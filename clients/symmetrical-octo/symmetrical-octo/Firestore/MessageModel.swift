//
//  MessageModel.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import Foundation
import FirebaseFirestore

struct Message: Identifiable, Codable, Equatable {
    @DocumentID var id: String?
    var message: String
    var sender: String
    var timestamp: Timestamp
    var gemini: Bool

    init(
        id: String? = nil,
        message: String = "",
        sender: String = "",
        timestamp: Timestamp = Timestamp(),
        gemini: Bool = false
    ) {
        self.id = id
        self.message = message
        self.sender = sender
        self.timestamp = timestamp
        self.gemini = gemini
    }
    
    static func ==(lhs: Message, rhs: Message) -> Bool {
        return lhs.id == rhs.id &&
               lhs.message == rhs.message &&
               lhs.sender == rhs.sender &&
               lhs.timestamp.isEqual(rhs.timestamp) &&
               lhs.gemini == rhs.gemini
    }
}
