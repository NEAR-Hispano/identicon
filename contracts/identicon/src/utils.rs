/*
    A poor-man random number generator

    From: https://users.rust-lang.org/t/random-number-without-using-the-external-crate/17260/9
    CREDITS: mgeisler - May '18
    > An easier way (in my opinion) to make a poor-mans-random-generator is to look at the current time when the program starts. This example find the current time, expresses it as a duration since 1970, and then extracts the number of nanoseconds elapsed in the current second:
    > So if the current time is 10:20:30.123456789, the "random" number will be 123456789. The number will always be between zero and 1 billion.
*/
use std::time::{SystemTime, UNIX_EPOCH};

pub fn cheap_random_gen(min: usize, max: usize) -> usize {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH) 
        .unwrap()
        .subsec_nanos() as f64;
    // remainder of int div, 3 last digits of time subsecs are random
    let rem = nanos as u64 % 1_000; 
    let index = ((rem as f64)/1000.0*((max+1 - min) as f64)) as usize;
    //println!("cheap_random_gen {} {} {} {}", nanos, rem, index, (max-min));
    min + index
}
