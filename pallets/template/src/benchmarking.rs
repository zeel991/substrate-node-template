#![cfg(feature = "runtime-benchmarks")]

use super::*;
use frame_benchmarking::{benchmarks, whitelisted_caller};
use frame_system::RawOrigin;
use sp_runtime::traits::Bounded;
use sp_std::prelude::*;

benchmarks! {
    where_clause { where T: Config }

    authorize_account {
        let caller: T::AccountId = whitelisted_caller();
        let new_account: T::AccountId = Bounded::max_value(); // using max value to simulate the worst-case
    }: _(RawOrigin::Signed(caller.clone()), new_account.clone())
    verify {
        assert!(<Account<T>>::contains_key(new_account));
    }

    register_statement {
        let caller: T::AccountId = whitelisted_caller();
        let new_account: T::AccountId = Bounded::max_value();
    }: _(RawOrigin::Signed(caller.clone()), new_account.clone())
    verify {
        assert!(<Statement<T>>::contains_key(new_account));
    }

    consume_statement {
        let caller: T::AccountId = whitelisted_caller();
        let target_account: T::AccountId = Bounded::max_value();

        // Insert a statement in registered status to be consumed
        <Statement<T>>::insert(&target_account, StatementStatus::Registered);
        // Insert the caller as an authorized account
        <Account<T>>::insert(&caller, true);
    }: _(RawOrigin::Signed(caller.clone()), target_account.clone())
    verify {
        assert_eq!(<Statement<T>>::get(target_account), Some(StatementStatus::Consumed));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use frame_support::assert_ok;
    use sp_io::TestExternalities;

    #[test]
    fn benchmarks_run() {
        TestExternalities::default().execute_with(|| {
            assert_ok!(test_benchmark_authorize_account());
            assert_ok!(test_benchmark_register_statement());
            assert_ok!(test_benchmark_consume_statement());
        });
    }
}
