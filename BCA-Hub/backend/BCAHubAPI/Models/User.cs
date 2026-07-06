using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BCAHubAPI.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("rollNumber")]
    public string RollNumber { get; set; } = string.Empty;

    [BsonElement("semester")]
    public string Semester { get; set; } = string.Empty;

    [BsonElement("college")]
    public string College { get; set; } = string.Empty;

    [BsonElement("course")]
    public string Course { get; set; } = "BCA Student";

    [BsonElement("completedCourses")]
    public string CompletedCourses { get; set; } = "0";

    [BsonElement("quizScore")]
    public string QuizScore { get; set; } = "0";

    [BsonElement("progress")]
    public string Progress { get; set; } = "0";

    [BsonElement("skills")]
    public string Skills { get; set; } = string.Empty;

    [BsonElement("about")]
    public string About { get; set; } = string.Empty;

    [BsonElement("avatar")]
    public string Avatar { get; set; } = "../assets/images/profile.png";

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty;
}
