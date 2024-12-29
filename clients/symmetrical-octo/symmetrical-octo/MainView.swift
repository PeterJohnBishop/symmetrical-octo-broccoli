//
//  MainView.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/23/24.
//

import SwiftUI
import FirebaseCore

struct MainView: View {
    
    @State private var authentication: FireAuthViewModel = FireAuthViewModel()
    @State private var gemini: GeminiAIViewModel = GeminiAIViewModel()
    @State private var messageViewModel: MessageViewModel = MessageViewModel()
    @State private var userLoaded: Bool = false
    @State private var ask: String = ""
    @State private var authToken: String = ""

    
    var body: some View {
        VStack{
            if let currentUser = authentication.user {
                Text(currentUser.uid)
                Text(currentUser.email ?? "Email not found.")
                Spacer()
                if !gemini.reply.isEmpty {
                    GroupBox("Gemini", content: {
                        Text(gemini.reply)
                    })
                }
                TextField("Ask Gemini", text: $gemini.query)
                    .tint(.black)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .padding()
                Button {
                    Task {
                        do {
                            let (ask, reply) = try await gemini.askGeminiBasic()
                            if ask {
                                messageViewModel.message.message = gemini.query
                                messageViewModel.message.sender = authentication.user!.uid
                                let currentDate = Date()
                                messageViewModel.message.timestamp = Timestamp(date: currentDate)
                                messageViewModel.message.gemini = false
                                let (success, response) = try await messageViewModel.saveMessage()
                                if !success {
                                    print(response)
                                }
                            }
                        } catch {
                            print("Error: \(error.localizedDescription)")
                        }
                    }
                } label: {
                    Text("Submit")
                } .fontWeight(.ultraLight)
                    .foregroundColor(.black)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.white)
                            .shadow(color: .gray.opacity(0.4), radius: 4, x: 2, y: 2)
                    )

            } else {
                ProgressView()
            }
        }.onAppear{
            authentication.GetCurrentUser { userFound, message in
                if userFound {
                    userLoaded = userFound
                    print(message)
                    authentication.user?.getIDToken(completion: { token, error in
                        if error != nil {
                            print(error?.localizedDescription ?? "")
                        } else {
                            UserDefaults.standard.set(token, forKey: "auth")
                            authToken = UserDefaults.standard.string(forKey: "auth") ?? "Token Not Found"
                        }
                    })
                }
            }
        }
    }
}

#Preview {
    MainView()
}
