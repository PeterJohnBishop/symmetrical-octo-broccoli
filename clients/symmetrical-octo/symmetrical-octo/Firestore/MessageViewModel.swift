//
//  MessageViewModel.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import Foundation
import Observation
import FirebaseFirestore

@Observable class MessageViewModel {
    var message: Message = Message()
    var messages: [Message] = []
    var baseUrl = "http://192.168.0.134:8080"
    var localBaseUrl = "http://127.0.0.1:8080"
    let db = Firestore.firestore()
    
    func saveMessage() async throws -> (Bool, String) {
            guard let url = URL(string: "\(localBaseUrl)/gemini/transcript/add") else {
                throw URLError(.badURL)
            }
            
            guard let token = UserDefaults.standard.string(forKey: "auth") else {
                throw NSError(domain: "saveMessage", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to set authorization token"])
            }
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            // Convert `Message` object to JSON
            let body: [String: Any] = [
                "message": message.message,
                "sender": message.sender,
                "timestamp": message.timestamp.dateValue().iso8601String(), // Convert Firestore `Timestamp` to ISO8601
                "gemini": message.gemini
            ]
            
            guard let jsonData = try? JSONSerialization.data(withJSONObject: body, options: []) else {
                throw NSError(domain: "saveMessage", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode request body as JSON"])
            }
            
            request.httpBody = jsonData
            
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            // Debug raw response for troubleshooting
            let responseString = String(data: data, encoding: .utf8) ?? "Invalid response"
            print("Raw response string:", responseString)
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                do {
                    let decoder = JSONDecoder()
                    let message = try decoder.decode(Message.self, from: data)
                    
                    // Save the messages to self.messages (ensure @MainActor for UI updates)
                    await MainActor.run {
                        self.messages = messages
                    }
                    
                    return (true, "Message successfully saved")
                } catch {
                    let errorMessage = "Error decoding JSON: \(error.localizedDescription)"
                    print(errorMessage)
                    return (false, errorMessage)
                }
            } else {
                let errorMessage = "Error: Unexpected response code \(response)"
                print(errorMessage)
                return (false, errorMessage)
            }
        } catch {
            let errorMessage = "Error submitting data: \(error.localizedDescription)"
            print(errorMessage)
            throw error
        }
    }

}

extension Date {
    func iso8601String() -> String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
}
