using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PortfolioMVC.Utils
{
    public class ClaimBuilder
    {
        public static ClaimBuilder Instance(string issuer, string originalIssuer) => new ClaimBuilder(issuer, originalIssuer);
        public static ClaimBuilder Instance(Claim baseClaim) => new ClaimBuilder(baseClaim.Issuer, baseClaim.OriginalIssuer);
        private string issuer;
        private string originalIssuer;
        public ClaimBuilder(string issuer, string originalIssuer)
        {
            this.issuer = issuer;

            this.originalIssuer = originalIssuer;
        }

        public Claim CreateRole(string role)
        {
            return CreateClaim(ClaimTypes.Role, role);
        }
        public Claim CreateClaim(string name, object? value)
        {
            string type = GetValueType(value);
            string val = string.Empty;
            if (value is DateTime d)
                val = ((DateTimeOffset)d).ToUnixTimeSeconds().ToString();
            else if (value is DateTimeOffset o)
                val = o.ToUnixTimeSeconds().ToString();
            else if (value != null)
                val = value.ToString()!;

            return new Claim(name, val, type, issuer, originalIssuer);
        }
        private string GetValueType(object? value)
        {
            switch (value)
            {
                case string:
                default:
                    return ClaimValueTypes.String;
                case int:
                    return ClaimValueTypes.Integer;
                case uint:
                    return ClaimValueTypes.UInteger32;
                case long:
                    return ClaimValueTypes.Integer64;
                case ulong:
                    return ClaimValueTypes.UInteger64;
                case float:
                case double:
                case decimal:
                    return ClaimValueTypes.Double;
                case DateTime:
                case DateTimeOffset:
                    return ClaimValueTypes.DateTime;
                case bool:
                    return ClaimValueTypes.Boolean;

            }
        }

    }
}
