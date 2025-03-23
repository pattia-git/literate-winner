using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
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

    public async Task<User?> ValidateUser(string email, string password)
    {
        
        Console.WriteLine(password);
        const string sql =
            @"SELECT users.id, users.firstname, users.lastname, users.email, r.role, users.username, users.password FROM users INNER JOIN public.roles r on r.id = users.role WHERE users.email = @email and users.password = @password";

        Console.WriteLine(email);
        Console.WriteLine(password);
        await using var cmd = _db.CreateCommand(sql);
        cmd.Parameters.AddWithValue("@email", email.ToLower());
        cmd.Parameters.AddWithValue("@password", password);
            
        {
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var storedPassword = reader.GetString(reader.GetOrdinal("password"));


                if (password == storedPassword)
                {
                    var user = new User
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        Email = reader.GetString(reader.GetOrdinal("email")),
                        Firstname = reader.GetString(reader.GetOrdinal("firstname")),
                        Lastname = reader.GetString(reader.GetOrdinal("lastname")),
                        Username = reader.GetString(reader.GetOrdinal("username")),
                        Role = reader.GetString(reader.GetOrdinal("role"))
                    };
                    Console.WriteLine($"User from DB: {JsonSerializer.Serialize(user)}");
                    return user;
                }
            }

            return null;

        }
    }
}