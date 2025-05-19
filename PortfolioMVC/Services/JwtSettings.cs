
using Microsoft.IdentityModel.Tokens;
using PortfolioMVC.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PortfolioMVC.Services
{
    public class JwtSecurityTokenValidator : ISecurityTokenValidator
    {
        public IHttpContextAccessor _httpContextAccessor { get; set; } = null!;
        private int _maxTokenSizeInBytes = TokenValidationParameters.DefaultMaximumTokenSizeInBytes;
        private JwtSecurityTokenHandler _tokenHandler;

        public JwtSecurityTokenValidator()
        {
            _tokenHandler = new JwtSecurityTokenHandler();
        }

        public bool CanValidateToken
        {
            get
            {
                return true;
            }
        }

        public int MaximumTokenSizeInBytes
        {
            get
            {
                return _maxTokenSizeInBytes;
            }

            set
            {
                _maxTokenSizeInBytes = value;
            }
        }

        public bool CanReadToken(string securityToken)
        {
            return _tokenHandler.CanReadToken(securityToken);
        }

        private void AddClaims(Claim baseClaim, ClaimsIdentity identiy)
        {
            ClaimBuilder cb = ClaimBuilder.Instance(baseClaim);
            identiy.AddClaim(cb.CreateRole("User"));

        }
        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters, out SecurityToken validatedToken)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
                throw new Exception("Context not be null");
            var principal = _tokenHandler.ValidateToken(securityToken, validationParameters, out validatedToken);
            var gid = principal.Claims.FirstOrDefault(m => m.Type == "gid");
            if (gid != null)
            {
                var identity = principal.Identities.First()!;
                AddClaims(gid, identity);
            }
            return principal;
        }
    }

}