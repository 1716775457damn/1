<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $to = '1716775457@qq.com';
    $subject = '新留言板消息';
    $message = "昵称: " . $data['nickname'] . "\n\n";
    $message .= "留言内容:\n" . $data['content'];
    $headers = 'From: ' . $data['nickname'] . ' <noreply@yourdomain.com>' . "\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to send email']);
    }
}
?> 