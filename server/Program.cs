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
User user = new();

var builder = WebApplication.CreateBuilder(args);

// här konfigureras sessionshantering
builder.Services.AddDistributedMemoryCache(); // ✅ Required for session storage
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(24); // ✅ Increase timeout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None; // ✅ Allow HTTP (since you’re not using HTTPS)
    options.Cookie.SameSite = SameSiteMode.Lax; // ✅ Prevent session loss in some browsers
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
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var loginData = JsonSerializer.Deserialize<User>(body);
    
    var user = await queries.ValidateUser(loginData.Email);
    if (user != null) { 
           
            // Retunerar inloggningsdata
            return Results.Ok(new { 
                user = new {
                    id = user.Id,
                    email = user.Email,
                    fname = user.Firstname,
                    lname = user.Lastname,
                    role = user.Role,
                    username = user.Username,
                    password = user.Password
                }
            });
    }
    return Results.Unauthorized();
}
    
    );


app.MapPost("/api/setSession", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var loginData = JsonSerializer.Deserialize<User>(body);

    var user = await queries.ValidateUser(loginData.Email);
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
            new Claim("role", user.Role),
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
});

app.MapGet("/api/checksession", async (HttpContext context) =>
{
    var userId = context.Session.GetString("UserId");
    var email = context.Session.GetString("UserEmail");
    var fname = context.Session.GetString("Firstname");
    var Lname = context.Session.GetString("Lastname");
    var username = context.Session.GetString("Username");
    var role = context.Session.GetString("Role");

    if (userId is null) // More explicit check for null
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new
    {
        username,
        userId,
        email,
        role,
        fname,
        Lname
    });
});

app.MapDelete("/api/clear-session", async (HttpContext context) =>
{
    await queries.ClearSession(context);
    return Results.Ok();
});

app.MapPost("/api/register", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var UserData = JsonSerializer.Deserialize<User?>(body);

    queries.registerNewUser(UserData);
});

app.MapGet("/api/blogpost", async (HttpContext context) =>
{
    var posts = await queries.GetBlogPosts();
    return posts;
});

app.MapPost("/api/newBlogPost", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var newPost = JsonSerializer.Deserialize<BlogPost>(body);
    
    
    // Can't fetch the userid from the session. Need a fix!!!!
    newPost.Timestamp = DateTime.Now;
    newPost.User = context.Session.GetString("UserId");

    await queries.newBlogPost(newPost, context);
    return Results.Ok();
});


app.Run();
