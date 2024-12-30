//
//  MessageModel.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import Foundation
import FirebaseFirestore
struct Gemini: Identifiable, Codable, Equatable {
    @DocumentID var id: String?
    var query: String
    var user: String
    var timestamp: Timestamp
    var reply: String

    init(
        id: String? = nil,
        query: String = "",
        user: String = "",
        timestamp: Timestamp = Timestamp(),
        reply: String = ""
    ) {
        self.id = id
        self.query = query
        self.user = user
        self.timestamp = timestamp
        self.reply = reply
    }
    
    enum CodingKeys: String, CodingKey {
        case id
        case query
        case user
        case timestamp
        case reply
    }

    // Custom initializer to decode the timestamp field correctly
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        // Decoding the other properties
        self.id = try container.decodeIfPresent(String.self, forKey: .id)
        self.query = try container.decodeIfPresent(String.self, forKey: .query) ?? ""
        self.user = try container.decodeIfPresent(String.self, forKey: .user) ?? ""
        
        // Decode the timestamp field
        if let timestampString = try? container.decodeIfPresent(String.self, forKey: .timestamp) {
            // Convert the ISO8601 string to a Date, then to a Timestamp
            let isoFormatter = ISO8601DateFormatter()
            if let date = isoFormatter.date(from: timestampString) {
                self.timestamp = Timestamp(date: date)
            } else {
                self.timestamp = Timestamp()  // Default value if the string cannot be parsed
            }
        } else {
            self.timestamp = try container.decodeIfPresent(Timestamp.self, forKey: .timestamp) ?? Timestamp()
        }

        self.reply = try container.decodeIfPresent(String.self, forKey: .reply) ?? ""
    }
    
    // Custom equality check
    static func ==(lhs: Gemini, rhs: Gemini) -> Bool {
        return lhs.id == rhs.id &&
               lhs.query == rhs.query &&
               lhs.user == rhs.user &&
               lhs.timestamp.isEqual(rhs.timestamp) &&
               lhs.reply == rhs.reply
    }
}
