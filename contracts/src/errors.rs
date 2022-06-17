
// Error status 
pub enum ReturnStatus<T> {
  Done(T),
  WillNotDo(String),
}

// Error messages
pub const AVAILABLE_REQUESTS_CONSUMED: &str = "All available requests have been used";
