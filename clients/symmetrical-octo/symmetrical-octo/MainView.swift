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
    @State private var geminiAI: GeminiAIViewModel = GeminiAIViewModel()
    @State private var gemini: GeminiViewModel = GeminiViewModel()
    @State private var userLoaded: Bool = false
    @State private var ask: String = ""
    @State private var authToken: String = ""
    @State var update: Bool = false

    
    var body: some View {
        VStack{
            if let currentUser = authentication.user {
                GeminiTranscriptView(update: $update)
                TextField("Ask Gemini", text: $geminiAI.query)
                    .tint(.black)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .padding()
                Button {
                    Task {
                        do {
                            let (ask, reply) = try await geminiAI.askGeminiBasic()
                            if ask {
                                gemini.gemini.query = geminiAI.query
                                gemini.gemini.user = authentication.user!.uid
                                let currentDate = Date()
                                gemini.gemini.timestamp = Timestamp(date: currentDate)
                                gemini.gemini.reply = reply
                                let (success, response) = try await gemini.saveTranscript()
                                update = success
                                geminiAI.query = ""
                                if !success {
                                    print("Error saving: \(response)")
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
                            update = true
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
