import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('未连接');

  // 测试后端连接
  const testBackendConnection = async () => {
    setLoading(true);
    setError('');
    setConnectionStatus('连接中...');

    try {
      console.log('🚀 开始测试后端连接...');

      // 使用完整URL或代理路径
      const response = await axios.get('/api/test/hello', {
        timeout: 5000
      });

      setBackendMessage(response.data);
      setConnectionStatus('✅ 连接成功');
      console.log('✅ 后端响应成功:', response.data);
    } catch (err) {
      const errorMsg = err.response
          ? `HTTP ${err.response.status}: ${err.response.statusText}`
          : err.message;

      setError(errorMsg);
      setConnectionStatus('❌ 连接失败');
      console.error('❌ 连接后端失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动测试
  useEffect(() => {
    // 延迟1秒自动测试，确保组件完全加载
    const timer = setTimeout(() => {
      testBackendConnection();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="App">
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>
            🏭 WMS 仓库管理系统
          </h1>

          {/* 连接状态卡片 */}
          <div style={{
            margin: '20px 0',
            padding: '20px',
            border: '2px solid #e1e1e1',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h2 style={{ color: '#495057', marginBottom: '15px' }}>
              🔌 前后端连接测试
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <strong>连接状态: </strong>
              <span style={{
                color: connectionStatus.includes('成功') ? '#28a745' :
                    connectionStatus.includes('失败') ? '#dc3545' : '#6c757d'
              }}>
              {connectionStatus}
            </span>
            </div>

            <button
                onClick={testBackendConnection}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
            >
              {loading ? '🔄 测试中...' : '🔄 重新测试连接'}
            </button>

            {/* 成功消息 */}
            {backendMessage && (
                <div style={{
                  marginTop: '15px',
                  padding: '15px',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '6px',
                  color: '#155724'
                }}>
                  <strong>✅ 连接成功！</strong><br/>
                  <strong>后端响应:</strong> {backendMessage}<br/>
                  <small>响应时间: {new Date().toLocaleTimeString()}</small>
                </div>
            )}

            {/* 错误消息 */}
            {error && (
                <div style={{
                  marginTop: '15px',
                  padding: '15px',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '6px',
                  color: '#721c24'
                }}>
                  <strong>❌ 连接失败！</strong><br/>
                  <strong>错误信息:</strong> {error}<br/>
                  <small>请确保后端服务正在运行</small>
                </div>
            )}
          </div>

          {/* 系统信息 */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e9ecef',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#495057'
          }}>
            <h3>📋 系统信息</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>📍 <strong>前端地址:</strong> http://localhost:3000</li>
              <li>📍 <strong>后端地址:</strong> http://localhost:8080</li>
              <li>📍 <strong>测试API:</strong> /api/test/hello</li>
              <li>📍 <strong>代理配置:</strong> 已启用 (package.json)</li>
              <li>📍 <strong>H2控制台:</strong> http://localhost:8080/h2-console</li>
            </ul>
          </div>

          {/* 下一步指南 */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            color: '#856404'
          }}>
            <h3>🚀 下一步开发指南</h3>
            <ol>
              <li>✅ 前后端连接测试 - 已完成</li>
              <li>🔄 创建库存管理API</li>
              <li>🔄 实现用户认证</li>
              <li>🔄 添加数据库实体</li>
              <li>🔄 构建前端界面</li>
            </ol>
          </div>
        </div>
      </div>
  );
}

export default App;