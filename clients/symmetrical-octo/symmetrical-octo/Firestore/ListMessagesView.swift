//
//  ListMessagesView.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import SwiftUI

struct ListMessagesView: View {
    
    @State private var authentication: FireAuthViewModel = FireAuthViewModel()
    @State private var messageViewModel: MessageViewModel = MessageViewModel()
    @State private var userLoaded: Bool = false
    
    var body: some View {
        VStack{
            Text("loading.")
        }.onAppear {
            authentication.GetCurrentUser { loaded, message in
                userLoaded = loaded
                print(message)
            }
        }
    }
}

#Preview {
    ListMessagesView()
}
