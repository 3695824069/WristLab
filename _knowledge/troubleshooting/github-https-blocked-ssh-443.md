# GitHub HTTPS 被阻断，改用 SSH over 443 推送

## 故障现象

- `git push` 失败：`Failed to connect to github.com port 443 ... Could not connect to server`
- `curl https://github.com`、`curl https://api.github.com` 全部 000（连接失败）
- 但浏览器能正常打开 GitHub，PowerShell `Invoke-WebRequest` 返回 200
- `ssh -T -p 443 git@ssh.github.com` 却可以连通（返回 Permission denied 也说明 TCP 通了）

## 原因

网络对 `github.com` 的 HTTPS 443 端口做选择性阻断（域名/IP 级），且 Git Bash 的 curl 与 Windows 应用（浏览器/PowerShell）走不同网络路径。但 `ssh.github.com:443`（GitHub 官方 SSH-over-HTTPS 通道）未被阻断。

## 解决方案（一次性配置，永久生效）

1. 生成密钥（如没有）：
   ```bash
   ssh-keygen -t ed25519 -C "melt@wristlab" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub   # 复制后到 github.com/settings/keys 添加
   ```

2. 配置 SSH 走 443 端口（`~/.ssh/config`）：
   ```
   Host github.com
     HostName ssh.github.com
     Port 443
     User git
   ```

3. 切换 remote 为 SSH：
   ```bash
   git remote set-url origin git@github.com:3695824069/WristLab.git
   ```

4. 验证 + 推送：
   ```bash
   ssh -T git@github.com        # 应显示 "Hi <用户名>! You've successfully authenticated"
   git push origin main
   ```

## 排查技巧

- 区分「网络不通」vs「git 不通」：用 PowerShell 测 `Invoke-WebRequest https://github.com`，通了说明 Windows 网络栈没问题，是 Git Bash 的问题
- 检查代理：`env | grep -i proxy`（残留代理变量会让 curl 走死代理）；`netsh winhttp show proxy`；常见本地代理端口探测 7890/7897/10809/1080
- HTTPS 全被挡时，先试 `ssh -T -p 443 git@ssh.github.com` — 这条通道经常是通的
