using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCAHubAPI.Configurations;
using BCAHubAPI.Data;
using BCAHubAPI.DTOs;
using BCAHubAPI.Interfaces;
using BCAHubAPI.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace BCAHubAPI.Services;

public class AuthService : IAuthService
{
    private readonly MongoDbContext _context;
    private readonly JwtSettings _jwt;

    public AuthService(MongoDbContext context, IOptions<JwtSettings> jwt)
    {
        _context = context;
        _jwt = jwt.Value;
    }

    public async Task<AuthResult> RegisterAsync(RegisterDto dto)
    {
        try
        {
        dto.Email = (dto.Email ?? string.Empty).Trim().ToLowerInvariant();
        dto.Name = (dto.Name ?? string.Empty).Trim();
        dto.RollNumber = (dto.RollNumber ?? string.Empty).Trim();
        dto.Semester = (dto.Semester ?? string.Empty).Trim();
        dto.Password = (dto.Password ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return new AuthResult { Success = false, Message = "Name, email and password are required" };
        }

        var existingUser = await _context.Users
            .Find(x => x.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            return new AuthResult { Success = false, Message = "User already exists" };
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            RollNumber = dto.RollNumber,
            Semester = dto.Semester,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, BCrypt.Net.SaltRevision.Revision2A)
        };

        await _context.Users.InsertOneAsync(user);

        var token = GenerateJwtToken(user);

        return new AuthResult
        {
            Success = true,
            Message = "User registered successfully",
            Token = token,
            User = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.RollNumber,
                user.Semester
            }
        };
        }
        catch (Exception ex)
        {
            return new AuthResult { Success = false, Message = $"An error occurred: {ex.Message}" };
        }
    }

    public async Task<AuthResult> LoginAsync(LoginDto dto)
    {
        try
        {
        dto.Email = (dto.Email ?? string.Empty).Trim().ToLowerInvariant();
        dto.Password = (dto.Password ?? string.Empty).Trim();

        var user = await _context.Users
            .Find(x => x.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return new AuthResult { Success = false, Message = "Invalid email or password" };
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash.Trim()))
        {
            return new AuthResult { Success = false, Message = "Invalid email or password" };
        }

        var token = GenerateJwtToken(user);

        return new AuthResult
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            User = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.RollNumber,
                user.Semester
            }
        };
        }
        catch (Exception ex)
        {
            return new AuthResult { Success = false, Message = $"An error occurred: {ex.Message}" };
        }
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwt.ExpiryHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
