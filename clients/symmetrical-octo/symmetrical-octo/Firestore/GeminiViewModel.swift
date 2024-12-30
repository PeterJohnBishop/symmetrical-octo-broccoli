//
//  MessageViewModel.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import Foundation
import Observation
import FirebaseFirestore

@Observable class GeminiViewModel {
    var gemini: Gemini = Gemini()
    var gemeniTranscript: [Gemini] = []
    var baseUrl = "http://192.168.0.134:8080"
    var localBaseUrl = "http://127.0.0.1:8080"
    let db = Firestore.firestore()
    
    func saveTranscript() async throws -> (Bool, String) {
            guard let url = URL(string: "\(localBaseUrl)/gemini/transcript/add") else {
                throw URLError(.badURL)
            }
            
            guard let token = UserDefaults.standard.string(forKey: "auth") else {
                throw NSError(domain: "addTranscript", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to set authorization token"])
            }
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            let body: [String: Any] = [
                "query": gemini.query,
                "user": gemini.user,
                "timestamp": gemini.timestamp.dateValue().iso8601String(), // Convert Firestore `Timestamp` to ISO8601
                "reply": gemini.reply
            ]
            
            guard let jsonData = try? JSONSerialization.data(withJSONObject: body, options: []) else {
                print("in jsonData")
                throw NSError(domain: "addTranscript", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode request body as JSON"])
            }
            
            request.httpBody = jsonData
            
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            // Debug raw response for troubleshooting
            let responseString = String(data: data, encoding: .utf8) ?? "Invalid response"
            print("Raw response string:", responseString)
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                print("httpResponse: \(httpResponse)")
                do {
                    // Define a struct to match the API response
                    struct TranscriptResponse: Codable {
                        let message: String
                        let id: String
                    }
                    
                    let decoder = JSONDecoder()
                    let transcriptResponse = try decoder.decode(TranscriptResponse.self, from: data)
                    
                    return (true, "Transcript successfully saved with ID: \(transcriptResponse.id)")
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
    
    func getTranscript() async throws -> (Bool, String) {
        guard let url = URL(string: "\(localBaseUrl)/gemini/transcript/get") else {
            throw URLError(.badURL)
        }
        
        guard let token = UserDefaults.standard.string(forKey: "auth") else {
            throw NSError(domain: "getTranscript", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to set authorization token"])
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            // Debug raw response for troubleshooting
//            let responseString = String(data: data, encoding: .utf8) ?? "Invalid response"
            
//            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
//                // Decode Firestore JSON response
//                let rawDocuments = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: Any]]
//                
//                let transcripts: [Gemini] = rawDocuments?.compactMap { doc -> Gemini? in
//                    guard
//                        let query = doc["query"] as? String,
//                        let user = doc["user"] as? String,
//                        let timestampString = doc["timestamp"] as? String,
//                        let date = ISO8601DateFormatter().date(from: timestampString),
//                        let reply = doc["reply"] as? String
//                    else {
//                        print("Skipping invalid document: \(doc)")
//                        return nil // This skips invalid documents without breaking type inference
//                    }
//                    
//                    let timestamp = Timestamp(date: date)
//                    return Gemini(
//                        id: doc["id"] as? String,
//                        query: query,
//                        user: user,
//                        timestamp: timestamp,
//                        reply: reply
//                    )
//                } ?? []
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                let decodedTranscripts = try JSONDecoder().decode([Gemini].self, from: data)
                            self.gemeniTranscript = decodedTranscripts
                            return (true, "Transcript loaded successfully")
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
