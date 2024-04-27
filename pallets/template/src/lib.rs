#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;
#[cfg(test)]
mod mock; 
#[cfg(test)]
mod tests; 

pub mod types; 

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking; 
pub mod weights; 
pub use weights::*; 

#[frame_support::pallet]
pub mod pallet {
    use super::*; 
    use crate::types::StatementStatus; 
    use frame_support::pallet_prelude::*; 
    use frame_system::pallet_prelude::*; 
    use crate::weights::WeightInfo; 


    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type WeightInfo: WeightInfo; 
    }

    #[pallet::storage]
    #[pallet::getter(fn statement)]
    pub(super) type Statement<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, StatementStatus>;

    #[pallet::storage]
    #[pallet::getter(fn accounts)]
    pub type Accounts<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, bool>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        AccountAuthorized(T::AccountId), // Event for account authorization
        StatementRegistered(T::AccountId), // Event for statement registration
        StatementConsumed(T::AccountId, StatementStatus), // Event for statement consumption
    }


    #[pallet::error]
    pub enum Error<T> {
		// Error for already consumed statement
        AlreadyConsumed, 
		// Error for already authorized account
        AlreadyAuthorized, 
		// Error for unauthorized action
        UnAuthorized,
		// Error for identifier not found in storage
        IdentifierNotFound, 
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        // Extrinsic to authorize an account
		// The dispatchable function 'authorize_account()' is just a demo of having permissions 
		// and authorized accounts only to have the right to change the statement status 
        #[pallet::call_index(0)]
        #[pallet::weight(T::WeightInfo::authorize_account())]
        pub fn authorize_account(
            origin: OriginFor<T>, // Origin parameter for ensuring signed calls
            identifier: T::AccountId, // Identifier for the account to authorize
        ) -> DispatchResult {
            let who = ensure_signed(origin)?; // Ensure that the call is signed
			// Check if account is already authorized
            ensure!(!<Accounts<T>>::contains_key(&identifier), Error::<T>::AlreadyAuthorized); 
			// Insert into Accounts storage
            <Accounts<T>>::insert(&identifier, true); 

            Self::deposit_event(Event::AccountAuthorized(identifier)); // Emit event for account authorization
            Ok(())
        }

		// This dispatchable function will be used to set the statement status to Registered , 
		
        #[pallet::call_index(1)]
        #[pallet::weight(T::WeightInfo::register_statement())]
        pub fn register_statement(
            origin: OriginFor<T>, // Origin parameter for ensuring signed calls
            identifier: T::AccountId, // Identifier for the statement
        ) -> DispatchResult {
            let who = ensure_signed(origin)?; // Ensure that the call is signed

            ensure!(!<Statement<T>>::contains_key(&identifier), Error::<T>::AlreadyConsumed); // Check if statement is already consumed

            <Statement<T>>::insert(&identifier, StatementStatus::Registered); // Insert into Statement storage

            Self::deposit_event(Event::StatementRegistered(identifier)); // Emit event for statement registration
            Ok(())
        }

        // This Dispactchable function consume_statement() is used to change the statement status to consumed 
		// It will perform these main tasks : 
		//		Verification of authorized account
		//		Verification of the statement 
		//		Verification of Statement Status 
		//		Update the Statement status to consumed
        #[pallet::call_index(2)]
        #[pallet::weight(T::WeightInfo::consume_statement())]
        pub fn consume_statement(
            origin: OriginFor<T>, // Origin parameter for ensuring signed calls
            identifier: T::AccountId, // Identifier for the statement to consume
            authorizer: T::AccountId, // Identifier for the account authorizing
        ) -> DispatchResult {
            let who = ensure_signed(origin)?; 
			// Check if authorizer is authorized to change the statement status 
            ensure!(<Accounts<T>>::contains_key(&authorizer), Error::<T>::UnAuthorized); 
			// Check if identifier exists in Statement storage
            ensure!(<Statement<T>>::contains_key(&identifier), Error::<T>::IdentifierNotFound); 
			// Get current status of the statement
            let status = <Statement<T>>::get(&identifier).unwrap(); 
			// Ensure it's in the registered state
            ensure!(status == StatementStatus::Registered, Error::<T>::AlreadyConsumed); 
			// Update the status to Consumed
            <Statement<T>>::insert(&identifier, StatementStatus::Consumed); 

            Self::deposit_event(Event::StatementConsumed(identifier, StatementStatus::Consumed)); // Emit event for statement consumption

            Ok(())
        }
    }
}
