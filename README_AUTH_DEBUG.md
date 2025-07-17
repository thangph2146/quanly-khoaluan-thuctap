# Debug Authentication Issues

## Các lỗi phổ biến và cách debug

### 1. Lỗi 401 Unauthorized khi đăng nhập

**Nguyên nhân có thể:**
- NextAuth không lưu được access token từ Keycloak
- API client không gửi Authorization header
- Backend không validate được JWT token từ Keycloak
- Timing issue: API calls được gọi trước khi hoàn tất đăng nhập
- **JWT Audience Validation Failed**: Token có audience="account" nhưng backend expect "kong-gateway-client"

**Debug steps:**

1. **Kiểm tra NextAuth Session:**
```javascript
// Trong browser console
console.log(await getSession())
// Phải có accessToken field
```

2. **Kiểm tra API Client logs:**
```
API Client: Session status: true Token status: true
API Client: Added Authorization header for: /users/me
```

3. **Kiểm tra Backend logs:**
```
JWT Debug: Authorization header: PRESENT
JWT Debug: Token validated successfully  
JWT Debug: Keycloak User ID: <user-id>
```

### 2. JWT Audience Validation Failed

**Error:** `SecurityTokenInvalidAudienceException: IDX10214: Audience validation failed`

**Nguyên nhân:** JWT token từ Keycloak có audience="account" nhưng backend expect "kong-gateway-client"

**Quick Fix:**
```bash
# Run in DataManagementApi directory
.\quick-fix-audience.ps1
```

**Manual Fix:**
1. Edit `DataManagementApi/appsettings.Development.json`:
```json
{
  "Jwt": {
    "ValidateAudience": false
  }
}
```

2. Restart API server

**Production Solution:** Configure Kong Gateway và Keycloak client đúng audience

### 3. Timing Issues

**Vấn đề:** API calls được gọi trước khi user hoàn tất đăng nhập

**Solution:** 
- MenuProvider chỉ gọi API khi `status === 'authenticated'` AND `session?.accessToken` tồn tại
- useCurrentUser hook chờ đến khi có access token

### 4. Debug Logs Location

**Frontend:**
- `lib/api/client.ts` - API client logs
- `hooks/useMenus.tsx` - Menu provider logs  
- `hooks/use-current-user.ts` - Current user logs

**Backend:**
- `Program.cs` - JWT validation logs
- Console output khi chạy API

### 5. Remove Debug Logs

Để remove debug logs trong production:

1. **Frontend:** Remove console.log statements từ:
   - `lib/api/client.ts`
   - `hooks/useMenus.tsx` 
   - `hooks/use-current-user.ts`

2. **Backend:** Remove Console.WriteLine statements từ:
   - `Program.cs` JWT events

### 6. Test Endpoints

Sử dụng file `test-auth-endpoints.http` để test endpoints với JWT token thật.

**Lấy JWT token:**
1. Đăng nhập vào frontend
2. Mở Developer Tools -> Application -> Session Storage  
3. Tìm NextAuth session chứa accessToken
4. Copy token để test

### 7. Kong Gateway Configuration

Nếu đang sử dụng Kong Gateway, xem file `DataManagementApi/KONG_GATEWAY_CONFIG.md` để:
- Cấu hình Kong JWT plugin
- Fix audience validation issues
- Setup production deployment 