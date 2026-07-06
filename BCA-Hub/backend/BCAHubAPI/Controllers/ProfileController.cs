using BCAHubAPI.Data;
using BCAHubAPI.DTOs;
using BCAHubAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BCAHubAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly MongoDbContext _context;

    public ProfileController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = await GetCurrentUser();

        if (user == null)
        {
            return Unauthorized(new { message = "Login required" });
        }

        return Ok(new { user = ToProfileResponse(user) });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] ProfileDto dto)
    {
        var user = await GetCurrentUser();

        if (user == null || string.IsNullOrWhiteSpace(user.Id))
        {
            return Unauthorized(new { message = "Login required" });
        }

        var update = Builders<User>.Update
            .Set(x => x.Name, dto.FullName.Trim())
            .Set(x => x.Email, dto.Email.Trim().ToLowerInvariant())
            .Set(x => x.RollNumber, dto.RollNumber.Trim())
            .Set(x => x.College, dto.College.Trim())
            .Set(x => x.Course, dto.Course.Trim())
            .Set(x => x.Semester, dto.Semester.Trim())
            .Set(x => x.CompletedCourses, dto.CompletedCourses.Trim())
            .Set(x => x.QuizScore, dto.QuizScore.Trim())
            .Set(x => x.Progress, dto.Progress.Trim())
            .Set(x => x.Skills, dto.Skills.Trim())
            .Set(x => x.About, dto.About.Trim())
            .Set(x => x.Avatar, dto.Avatar);

        await _context.Users.UpdateOneAsync(x => x.Id == user.Id, update);

        var updatedUser = await _context.Users
            .Find(x => x.Id == user.Id)
            .FirstOrDefaultAsync();

        return Ok(new
        {
            message = "Profile saved successfully",
            user = ToProfileResponse(updatedUser)
        });
    }

    private async Task<User?> GetCurrentUser()
    {
        var token = Request.Headers.Authorization
            .ToString()
            .Replace("Bearer ", string.Empty)
            .Trim();

        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        return await _context.Users.Find(x => x.Id == token).FirstOrDefaultAsync();
    }

    private static object ToProfileResponse(User user)
    {
        return new
        {
            user.Id,
            fullName = user.Name,
            user.Email,
            user.RollNumber,
            user.College,
            user.Course,
            user.Semester,
            user.CompletedCourses,
            user.QuizScore,
            user.Progress,
            user.Skills,
            user.About,
            user.Avatar
        };
    }
}
