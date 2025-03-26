using System.Data;
using System.Text.Json;
using Npgsql;
using server.Classes;

namespace server;

public class Queries
{
    private NpgsqlDataSource _db;

    public Queries(NpgsqlDataSource db)
    {
        _db = db;
    }

    public async Task<User?> ValidateUser(string email)
    {
        const string sql =
            @"SELECT users.id, users.firstname, users.lastname, users.email, r.role, users.username, users.password FROM users INNER JOIN public.roles r on r.id = users.role WHERE users.email = @email";
        await using var cmd = _db.CreateCommand(sql);
        cmd.Parameters.AddWithValue("@email", email.ToLower());
            
        {
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                    var user = new User
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        Email = reader.GetString(reader.GetOrdinal("email")),
                        Firstname = reader.GetString(reader.GetOrdinal("firstname")),
                        Lastname = reader.GetString(reader.GetOrdinal("lastname")),
                        Username = reader.GetString(reader.GetOrdinal("username")),
                        Role = reader.GetString(reader.GetOrdinal("role")),
                        Password = reader.GetString(reader.GetOrdinal("password"))
                    };
                    Console.WriteLine($"User from DB: {JsonSerializer.Serialize(user)}");
                    return user;
            }

            return null;

        }
    }
    
    public async Task<IResult> ClearSession(HttpContext context)
    {
        Console.WriteLine("ClearSession is called..Clearing session");
        // Denna rad kan skrivas både med Task.Run() eller utan.
        await Task.Run(context.Session.Clear);
        return Results.Ok("Session cleared");
    }

    public async Task<IResult> registerNewUser(User user)
    {
        const string sql =
            @"INSERT INTO users (firstname, lastname, email, role, username, password) 
                values (@firstname, @lastname, @email, @role, @username, @password)";
        await using var cmd = _db.CreateCommand(sql);
        cmd.Parameters.AddWithValue("@firstname", user.Firstname);
        cmd.Parameters.AddWithValue("@lastname", user.Lastname);
        cmd.Parameters.AddWithValue("@email", user.Email);
        cmd.Parameters.AddWithValue("@role", 2);
        cmd.Parameters.AddWithValue("@username", user.Username);
        cmd.Parameters.AddWithValue("@password", user.Password);
        
        await cmd.ExecuteNonQueryAsync();
        return Results.Ok();
    }

    public async Task<List<BlogPost>> GetBlogPosts()
    {
        var blogPosts = new List<BlogPost>();
        const string sql = @"SELECT header, post, time, users.username FROM posts Inner Join users on posts.id = users.id";
        await using var cmd = _db.CreateCommand(sql);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            blogPosts.Add(new BlogPost()
            { 
                Header = reader.GetString(reader.GetOrdinal("header")),
                Post = reader.GetString(reader.GetOrdinal("post")),
                Timestamp = reader.GetDateTime(reader.GetOrdinal("time")),
                Author = reader.GetString(reader.GetOrdinal("username"))
            });
        }
        return blogPosts;
    }

    public async Task<IResult> newBlogPost(BlogPost postinfo, HttpContext context)
    {
        const string sql = @"Insert into posts (author, header, post, time) values (@userid, @header, @content, @timestamp)";
        await using var cmd = _db.CreateCommand(sql);
        

        cmd.Parameters.AddWithValue("@userid", Convert.ToInt32(postinfo.User));
        cmd.Parameters.AddWithValue("@header", postinfo.Header);
        cmd.Parameters.AddWithValue("@content", postinfo.Post);
        cmd.Parameters.AddWithValue("@timestamp", postinfo.Timestamp);
        await cmd.ExecuteNonQueryAsync();
        return Results.Ok();
    }
}