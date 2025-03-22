using server;
using server.Properties;

Database database = new();
var db = database.Connection();
Queries queries = new(db);

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


app.Run();
