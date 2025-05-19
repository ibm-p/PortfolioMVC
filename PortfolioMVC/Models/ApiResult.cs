namespace PortfolioMVC.Models
{
    public class ApiResult
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
        public static ApiResult Ok()
        {
            return new ApiResult { Success = true };
        }
        public static ApiResult Fail(string ? error = null)
        {
            return new ApiResult { Success = false, Error = error };
        }
    }
    public class ApiResult<T> :ApiResult
    {
        public T Data { get; set; } = default!;
    }
    public class ObjectApiResult : ApiResult<object?> { 
    
    }
    public class BoolApiResult : ApiResult<bool> { 
    }
}
