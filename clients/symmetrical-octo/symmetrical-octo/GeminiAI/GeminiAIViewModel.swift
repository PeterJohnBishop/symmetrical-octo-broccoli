//
//  GeminiAIViewModel.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import Foundation
import Observation

@Observable class GeminiAIViewModel: ObservableObject {
    var query: String = ""
    var reply: String = ""
    var baseUrl = ""
    var mobileBaseUrl = "http://192.168.0.134:8080"
    var localBaseUrl = "http://127.0.0.1:8080"
    
    struct GeminiResponse: Codable {
        let reply: String
    }
    
    func askGeminiBasic() async throws -> (Bool, String) {
        guard let url = URL(string: "\(localBaseUrl)/gemini/askBasic") else {
            throw URLError(.badURL)
        }
        
        guard let token = UserDefaults.standard.string(forKey: "auth") else {
            throw NSError(domain: "askGeminiBasic", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to set authorization token"])
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let body: [String: Any] = [
            "input": query,
        ]
        
        guard let jsonData = try? JSONSerialization.data(withJSONObject: body, options: []) else {
            throw NSError(domain: "askGeminiBasic", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode request body as JSON"])
        }
        
        request.httpBody = jsonData
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            // Debug raw response for troubleshooting
            let responseString = String(data: data, encoding: .utf8) ?? "Invalid response"
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                do {
                    let decoder = JSONDecoder()
                    
                    // Decode the response as a simple dictionary
                    let responseObject = try decoder.decode([String: String].self, from: data)
                    
                    if let reply = responseObject["reply"] {
                        self.reply = reply
                        return (true, reply)
                    } else {
                        let errorMessage = "Error: 'reply' key not found in response."
                        print(errorMessage)
                        self.reply = errorMessage
                        return (false, errorMessage)
                    }
                } catch {
                    let errorMessage = "Error decoding JSON: \(error.localizedDescription)"
                    print(errorMessage)
                    self.reply = errorMessage
                    return (false, errorMessage)
                }
            } else {
                let errorMessage = "Error: Unexpected response code \(response)"
                print(errorMessage)
                self.reply = errorMessage
                return (false, errorMessage)
            }
        } catch {
            let errorMessage = "Error submitting data: \(error.localizedDescription)"
            print(errorMessage)
            self.reply = errorMessage
            throw error
        }
    }

}

