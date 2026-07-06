namespace BCAHubAPI.DTOs;

public class ProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string College { get; set; } = string.Empty;
    public string Course { get; set; } = "BCA Student";
    public string Semester { get; set; } = string.Empty;
    public string CompletedCourses { get; set; } = "0";
    public string QuizScore { get; set; } = "0";
    public string Progress { get; set; } = "0";
    public string Skills { get; set; } = string.Empty;
    public string About { get; set; } = string.Empty;
    public string Avatar { get; set; } = "../assets/images/profile.png";
}
