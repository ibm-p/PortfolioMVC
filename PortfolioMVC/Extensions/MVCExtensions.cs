using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Security.Claims;

namespace PortfolioMVC.Extensions
{
    /// <summary>
    /// MVC için kullanılmak üzere
    /// </summary>
    public static class MVCExtensions
    {
        public static string GetModelErrors(this ModelStateDictionary state, string seperator = " | ")
        {
            string errors = string.Join(seperator,
       state.Values
           .SelectMany(v => v.Errors)
           .Select(e => e.ErrorMessage));
            return errors;
        }

    }
}
