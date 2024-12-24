//
//  FireAuth.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/23/24.
//

//
//  FireAuth.swift
//  symmetrical-octo
//
//  Created by m1_air on 12/23/24.
//

import Foundation
import FirebaseAuth
import Observation

@Observable class FireAuthViewModel: ObservableObject {
    var user: User?
    private var handle: AuthStateDidChangeListenerHandle?
    
    func CreateUser(email: String, password: String, completion: @escaping (Bool, String) -> Void) {
        Auth.auth().createUser(withEmail: email, password: password) { (result, error) in
            if let error = error {
                completion(false, error.localizedDescription) // Return false if error exists
                return
            }
            if let user = result?.user {
                self.user = user
                completion(true, "User created successfully.") // Success only if user is non-nil
            } else {
                completion(false, "Unexpected error occurred. No user was created.")
            }
        }
    }
    
    func fetchFirebaseAuthToken(completion: @escaping (Bool, String) -> Void) {
        guard let user = Auth.auth().currentUser else {
            completion(false, "No user is signed in.")
            return
        }
        
        user.getIDToken { token, error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else if let token = token {
                completion(true, token)
            } else {
                completion(false, "Failed to fetch token. Unexpected error.")
            }
        }
    }
    
    func GetCurrentUser(completion: @escaping (Bool, String) -> Void) {
        if let currentUser = Auth.auth().currentUser {
            self.user = currentUser
            completion(true, "User: \(currentUser.uid)")
        } else {
            completion(false, "No user signed in.")
        }
    }
    
    func ListenForUserState(completion: @escaping (Bool, String) -> Void) {
        handle = Auth.auth().addStateDidChangeListener { (auth, user) in
            if let user = user {
                completion(true, "Current User: \(user.uid)")
            } else {
                completion(false, "No user signed in.")
            }
        }
    }
    
    func StopListenerForUserState() {
        if let handle = handle {
            Auth.auth().removeStateDidChangeListener(handle)
            print("Listening for user state stopped.")
        }
    }
    
    func SignInWithEmailAndPassword(email: String, password: String, completion: @escaping (Bool, String) -> Void) {
        Auth.auth().signIn(withEmail: email, password: password) { (authResult, error) in
            if let error = error {
                completion(false, error.localizedDescription)
                return
            }
            if let user = authResult?.user {
                self.user = user
                completion(true, "Successfully signed in.")
            } else {
                completion(false, "Unexpected error occurred. No user signed in.")
            }
        }
    }
    
    func SendEmailVerification(completion: @escaping (Bool, String) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        currentUser.sendEmailVerification { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Email verification sent.")
            }
        }
    }

    func UpdateDisplayName(displayName: String, completion: @escaping (Bool, String) -> Void) {
        guard let user = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        let changeRequest = user.createProfileChangeRequest()
        changeRequest.displayName = displayName
        
        changeRequest.commitChanges { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Display name updated successfully.")
            }
        }
    }

    func UpdateProfile(photoURL: URL, completion: @escaping (Bool, String) -> Void) {
        guard let user = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        let changeRequest = user.createProfileChangeRequest()
        changeRequest.photoURL = photoURL
        
        changeRequest.commitChanges { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Profile photo updated successfully.")
            }
        }
    }

    func UpdateEmail(email: String, completion: @escaping (Bool, String) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        currentUser.sendEmailVerification(beforeUpdatingEmail: email) { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Update email verification sent.")
            }
        }
    }

    func UpdatePassword(password: String, completion: @escaping (Bool, String) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        currentUser.updatePassword(to: password) { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Password updated successfully!")
            }
        }
    }
    
    func SendPasswordReset(email: String, completion: @escaping (Bool, String) -> Void) {
        Auth.auth().sendPasswordReset(withEmail: email) { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "Password reset email sent.")
            }
        }
    }
    
    func DeleteCurrentUser(completion: @escaping (Bool, String) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(false, "No user is currently signed in.")
            return
        }
        
        currentUser.delete { error in
            if let error = error {
                completion(false, error.localizedDescription)
            } else {
                completion(true, "User account deleted successfully.")
            }
        }
    }
    
    func SignOut(completion: @escaping (Bool, String) -> Void) {
        do {
            try Auth.auth().signOut()
            self.user = nil
            completion(true, "Signed out successfully.")
        } catch let signOutError as NSError {
            completion(false, signOutError.localizedDescription)
        }
    }
}
