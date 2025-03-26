namespace server.Classes;

public class BlogPost
{
    public int? User { get; set; }
    
    public string? Author { get; set; }
    public string Header { get; set; }
    public string Post { get; set; }
    public DateTime Timestamp { get; set; }
}