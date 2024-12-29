//
//  SignUpView.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/23/24.
//

import SwiftUI

struct AuthView: View {
    
    @State private var newUser: Bool = false
    @State private var authentication: FireAuthViewModel = FireAuthViewModel()
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var verifyPassword: String = ""
    @State private var showAlert: Bool = false
    @State private var alertHeadline: String = ""
    @State private var alertContent: String = ""
    @State private var navigate: Bool = false
    
    var body: some View {
        NavigationStack{
           VStack{
               Spacer()
               Text(newUser ? "SignUp" : "Login").font(.system(size: 34))
                   .fontWeight(.ultraLight)
               Divider().padding()
               TextField("Email", text: $email)
                   .tint(.black)
                   .autocapitalization(.none)
                   .disableAutocorrection(true)
                   .padding()
               SecureField("Password", text: $password)
                   .tint(.black)
                   .autocapitalization(.none)
                   .disableAutocorrection(true)
                   .padding()
               if newUser {
                   SecureField("Verify Password", text: $verifyPassword)
                       .tint(.black)
                       .autocapitalization(.none)
                       .disableAutocorrection(true)
                       .padding()
                       
               }
               Button("Submit", action: {
                   if newUser {
                       if password == verifyPassword {
                           Task {
                               authentication.CreateUser(email: email, password: password) { created, message in
                                   if created {
                                       navigate = true
                                   } else {
                                       alertHeadline = "Sign up error."
                                       alertContent = message
                                       showAlert = true
                                   }
                               }
                           }
                       }
                       
                   } else {
                       Task {
                           authentication.SignInWithEmailAndPassword(email: email, password: password) { signedIn, message in
                               if signedIn == true {
                                   navigate = true
                               } else {
                                   alertHeadline = "Authentication Error"
                                   alertContent = message
                                   showAlert = true
                               }
                           }
                       }
                   }
               })
               .fontWeight(.ultraLight)
               .foregroundColor(.black)
               .padding()
               .background(
                   RoundedRectangle(cornerRadius: 8)
                       .fill(Color.white)
                       .shadow(color: .gray.opacity(0.4), radius: 4, x: 2, y: 2)
               )
               .navigationDestination(isPresented: $navigate, destination: {
                   MainView().navigationBarBackButtonHidden(true)
               })
               .alert(alertHeadline, isPresented: $showAlert) {
                               Button("OK", role: .cancel) {
                                   email = ""
                                   password = ""
                                   verifyPassword = ""
                               }
                           } message: {
                               Text(alertContent)
                           }
               
               Spacer()
               HStack{
                   Spacer()
                   Text(newUser ? "I don't have an account." : "I have an account.").fontWeight(.ultraLight)
                   Button(newUser ? "Login" : "Register", action: {
                       newUser.toggle()
                   }).foregroundStyle(.black)
                       .fontWeight(.light)
                   Spacer()
               }
           }.onAppear{
               Task {
                   authentication.SignOut { signedOut, message in
                       if signedOut {
                           print(message)
                           authentication.StopListenerForUserState()
                       } else {
                           alertHeadline = "Error"
                           alertContent = message
                           showAlert = true
                       }
                   }
               }
           }
       }
    }
}

#Preview {
    AuthView()
}
