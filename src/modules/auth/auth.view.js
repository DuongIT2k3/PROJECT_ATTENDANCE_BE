export const generateResetPasswordEmail = (resetLink, expiresIn) => {
	return /*html*/ `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CF - Đặt lại mật khẩu</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .content h2 {
          font-size: 24px;
          margin-top: 0;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Đặt lại mật khẩu - CodeFarm</h1>
        </div>
        <div class="content">
          <h2>Xin chào,</h2>
          <p>
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào nút dưới đây để tiếp tục:
          </p>
          <a href="${resetLink}" class="button">Đặt lại mật khẩu</a>
          <p>
            Link này sẽ hết hạn sau <strong>${expiresIn}</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>

          <p>Trong trường hợp link không hoạt động, vui lòng sao chép đường dẫn này và dán vào trình duyệt: ${resetLink}</p>
          <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
        </div>
        <div class="footer">
          <p>
            &copy; ${new Date().getFullYear()} CodeFarm. All rights reserved.
          </p>
          <p>
            <a href="https://codefarm.edu.vn">Trang chủ</a> |
            <a href="mailto:support@codefarm.edu.vn">Liên hệ</a> |
            <a href="https://codefarm.edu.com/privacy">Chính sách bảo mật</a>
          </p>
          <p>Toà 7F đường Hà Lê - Kim Hoàng - Vân Canh - Hoài Đức - Hà Nội</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generatePasswordResetSuccessEmail = () => /*html*/ `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CF - Mật khẩu đã được đặt lại</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #28a745;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px;
        color: #333333;
      }
      .content h2 {
        font-size: 24px;
        margin-top: 0;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
      }
      .footer {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>CodeFarm - Mật khẩu đã được đặt lại</h1>
      </div>
      <div class="content">
        <h2>Xin chào,</h2>
        <p>
          Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập vào tài khoản của mình với mật khẩu mới.
        </p>
        <p>
          Nếu bạn không thực hiện hành động này, vui lòng liên hệ với chúng tôi ngay lập tức qua email
          <a href="mailto:support@codefarm.edu.vn">support@codefarm.edu.vn</a>.
        </p>
        <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
      </div>
      <div class="footer">
        <p>
          © ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>
        <p>
          <a href="https://codefarm.edu.vn">Trang chủ</a> |
          <a href="mailto:support@codefarm.edu.vn">Liên hệ</a> |
          <a href="https://codefarm.edu.vn/privacy">Chính sách bảo mật</a>
        </p>
        <p>Toà 7F đường Hà Lê - Kim Hoàng - Vân Canh - Hoài Đức - Hà Nội</p>
      </div>
    </div>
  </body>
  </html>
`;