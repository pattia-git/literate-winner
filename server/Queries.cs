using Npgsql;

namespace server;

public class Queries
{
    private NpgsqlDataSource _db;

    public Queries(NpgsqlDataSource db)
    {
        _db = db;
    }
}