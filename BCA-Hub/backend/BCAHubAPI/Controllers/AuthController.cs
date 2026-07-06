using BCAHubAPI.Data;
using BCAHubAPI.DTOs;
using BCAHubAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BCAHubAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbContext _context;

    public AuthController(MongoDbContext context)
    {
        _context = context;
    }

    // REGISTER API
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        dto.Email = dto.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new
            {
                message = "Name, email and password are required"
            });
        }

        var existingUser = await _context.Users
            .Find(x => x.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "User already exists"
            });
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = dto.Email,
            RollNumber = dto.RollNumber.Trim(),
            Semester = dto.Semester.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        await _context.Users.InsertOneAsync(user);

        return Ok(new
        {
            message = "User registered successfully"
        });
    }

    // LOGIN API
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        dto.Email = dto.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .Find(x => x.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Invalid email or password"
            });
        }

        bool isPasswordCorrect =
            BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordCorrect)
        {
            return BadRequest(new
            {
                message = "Invalid email or password"
            });
        }

        return Ok(new
        {
            message = "Login successful",
            token = user.Id,
            user = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.RollNumber,
                user.Semester
            }
        });
    }
}
