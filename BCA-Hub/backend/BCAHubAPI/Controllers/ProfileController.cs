using System.Security.Claims;
using BCAHubAPI.Data;
using BCAHubAPI.DTOs;
using BCAHubAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BCAHubAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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

        dto.Sanitize();

        var update = Builders<User>.Update
            .Set(x => x.Name, dto.FullName)
            .Set(x => x.Email, dto.Email.ToLowerInvariant())
            .Set(x => x.RollNumber, dto.RollNumber)
            .Set(x => x.College, dto.College)
            .Set(x => x.Course, dto.Course)
            .Set(x => x.Semester, dto.Semester)
            .Set(x => x.CompletedCourses, dto.CompletedCourses)
            .Set(x => x.QuizScore, dto.QuizScore)
            .Set(x => x.Progress, dto.Progress)
            .Set(x => x.Skills, dto.Skills)
            .Set(x => x.About, dto.About)
            .Set(x => x.Avatar, dto.Avatar);

        await _context.Users.UpdateOneAsync(x => x.Id == user.Id, update);

        var updatedUser = await _context.Users
            .Find(x => x.Id == user.Id)
            .FirstOrDefaultAsync();

        if (updatedUser == null)
        {
            return NotFound(new { message = "User not found after update" });
        }

        return Ok(new
        {
            message = "Profile saved successfully",
            user = ToProfileResponse(updatedUser)
        });
    }

    private async Task<User?> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return null;
        }

        return await _context.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
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
