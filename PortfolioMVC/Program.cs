using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PortfolioMVC.Data;
using PortfolioMVC.Data.Business;
using PortfolioMVC.Data.Utils;
using PortfolioMVC.Models;
using PortfolioMVC.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


//.cshtml deðiþikliklerinin anlýk olarak uygulanabilmesi için dâhil edildi.
builder.Services.AddControllersWithViews()
       .AddRazorRuntimeCompilation();

builder.Services.AddDbContext<PDbContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=PortfolioMVCDB;Trusted_Connection=True;TrustServerCertificate=True;"));

// Add services to the container.

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<UserService, UserService>();
builder.Services.AddScoped<ImageService, ImageService>();
builder.Services.AddScoped<ContactService, ContactService>();

builder.Services.AddControllers().AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null).AddJsonOptions(ops => ops.JsonSerializerOptions.IncludeFields = true);

builder.Services.AddScoped<PersonalService, PersonalService>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["jwt"];
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        ValidateLifetime = true
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.MapControllerRoute(
    name: "default2",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");



app.Run();
