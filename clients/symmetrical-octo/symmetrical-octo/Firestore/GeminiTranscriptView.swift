//
//  ListMessagesView.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/29/24.
//

import SwiftUI

struct GeminiTranscriptView: View {
    @Binding var update: Bool
    @State private var authentication: FireAuthViewModel = FireAuthViewModel()
    @State private var geminiViewModel: GeminiViewModel = GeminiViewModel()
    @State private var userLoaded: Bool = false
    @State private var trasnscriptLoaded: Bool = false
    
    var body: some View {
        ScrollViewReader { proxy in
            ScrollView(.vertical, showsIndicators: true) {
                VStack {
                    // Reversed the list by applying reversed() on the data source
                    ForEach(geminiViewModel.gemeniTranscript.sorted { ($0.timestamp.dateValue() < $1.timestamp.dateValue()) }, id: \.id) { query in
                        GroupBox(content: {
                            VStack {
                                Text(query.query)
                                GroupBox("Gemini", content: {
                                    Text(query.reply)
                                })
                            }
                        })
                        .id(query.id) // Assign an ID to each item
                        .padding()
                    }
                }
                .onAppear {
                    authentication.GetCurrentUser { success, message in
                        userLoaded = success
                        print(message)
                    }
                    Task {
                        do {
                            let (success, message) = try await geminiViewModel.getTranscript()
                            trasnscriptLoaded = success
                            update = false
                            if !success {
                                update = true
                            }
                            print(message)
                        }
                    }
                }
                .onChange(of: geminiViewModel.gemeniTranscript) {
                    let lastItem = geminiViewModel.gemeniTranscript
                        .sorted { $0.timestamp.dateValue() > $1.timestamp.dateValue() }
                        .first! as Gemini
                    proxy.scrollTo(lastItem.id, anchor: .bottom)
                        
                }
                .onChange(of: update) {
                    Task {
                        do {
                            let (success, message) = try await geminiViewModel.getTranscript()
                            trasnscriptLoaded = success
                            update = false
                            if !success {
                                update = true
                            }
                            print(message)
                        }
                    }
                }
            }
        }
    }
}







//#Preview {
//    GeminiTranscriptView()
//}
