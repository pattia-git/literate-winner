using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using server;
using server.Classes;
using server.Properties;

Database database = new();
var db = database.Connection();
Queries queries = new(db);
LoginDetails LoginDetails = new();

var builder = WebApplication.CreateBuilder(args);

// här konfigureras sessionshantering
builder.Services.AddDistributedMemoryCache();  // bra att veta att detta använder minnescache för sessioner
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10); //om du är inaktiv så kommer du bli utloggad efter en vis tid har satt en minut för tester
    options.Cookie.HttpOnly = true; // Skyddar så att cookien inte kan nås via js
    options.Cookie.IsEssential = true; // Cookien krävs för att sessionen ska kunna fungera
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // cookien skickas bara via https
    options.Cookie.SameSite = SameSiteMode.Strict; // förhindrar att cookien skickas vid externa förfrågningar
});

// här konfiguerar vi autentisering med cookies 
builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", options =>
    {
        options.LoginPath = "/api/login";  // om den som använder sidan inte är behörig så skickas den tillbaka till log in 
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
        options.Cookie.SameSite = SameSiteMode.Strict; 
    });

builder.Services.AddAuthorization(); // Detta aktiverar behörighetssystem

var app = builder.Build();
app.UseSession();  //aktiverar Sessionshanteringen
app.UseRouting(); // aktiverar routing för API-endpoints
app.UseAuthentication(); // Aktiverar autentisering
app.UseAuthorization();  // aktiverar behörighetshantering

app.MapPost("/api/login", async (HttpContext context) =>
{
    Console.WriteLine("hejsan");
    
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var loginData = JsonSerializer.Deserialize<LoginRequest>(body);
    
    var user = await queries.ValidateUser(loginData.Email, loginData.Password);
            if (user != null) 
            { 
                var authProperties = new AuthenticationProperties
            {
                IsPersistent = true, // behåller sessionen även om den har stängts 
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(24) // sessionen gäller i 24 timmar 
            };
            
            // Skapar en cookie-baserad autentisering för användaren. 
            await context.SignInAsync(
                "CookieAuth",  
                new ClaimsPrincipal(new ClaimsIdentity(
                    new[] {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  //sparar användarens Id
                        new Claim(ClaimTypes.Email, user.Email), // sparar användarens e-post 
                        new Claim("role", user.Role), // sparar om användaren är admin eller inte
                        new Claim("username", user.Username) // sparar om användaren är admin eller inte

                    },
                    "CookieAuth")),
                authProperties
            );
            
             // lagrar användarensinformation i sessionen
            context.Session.SetString("UserId", user.Id.ToString());
            context.Session.SetString("UserEmail", user.Email);
            context.Session.SetString("Firstname", user.Firstname);
            context.Session.SetString("Lastname", user.Lastname);
            context.Session.SetString("Role", user.Role);
            context.Session.SetString("Username", user.Username);
            
            // Retunerar inloggningsdata
            return Results.Ok(new { 
                user = new {
                    id = user.Id,
                    email = user.Email,
                    fname = user.Firstname,
                    lname = user.Lastname,
                    role = user.Role,
                    username = user.Username 
                }
            });
    }
    return Results.Unauthorized();
}
    
    );

app.Run();
