const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { expressjwt: expressJwt } = require('express-jwt');
const cors = require('cors');

const app = express();

app.use(cors());

const JWT_SECRET = 'p3hf9dsz2nf9dl2kc9sj27dcw23x';
const authenticateJWT = expressJwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true,
}).unless({ path: ['/gateway/users/check_user', '/gateway/users/add_user'] });

app.use((req, res, next) => {
    console.log(`Request Path: ${req.originalUrl}`);
    next();
});

app.use(authenticateJWT, (req, res, next) => {
    if (req.auth) {
        req.headers['x-user-id'] = req.auth['x-user-id'];
    }
    next();
});

const USERS_SERVICE_URL = 'http://users:8080';
const POSTS_SERVICE_URL = 'http://posts:8080';
const COMMENTS_SERVICE_URL = 'http://comments:8080';
const REPLIES_SERVICE_URL = 'http://replies:8080';
const RECOMMENDATIONS_SERVICE_URL = 'http://recommendations:8080';
const SEARCH_SERVICE_URL = 'http://filter:8080';
const FILTER_SERVICE_URL = 'http://search:8080';

app.use('/gateway/users', createProxyMiddleware({
    target: USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/users': '',
    },
}));

app.use('/gateway/posts', createProxyMiddleware({
    target: POSTS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/posts': '',
    },
}));

app.use('/gateway/comments', createProxyMiddleware({
    target: COMMENTS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/comments': '',
    },
}));

app.use('/gateway/recommendations', createProxyMiddleware({
    target: RECOMMENDATIONS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/recommendations': '',
    },
}));

app.use('/gateway/replies', createProxyMiddleware({
    target: REPLIES_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/replies': '', 
    },
}));

app.use('/gateway/filter', createProxyMiddleware({
    target: FILTER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/filter': '', 
    },
}));

app.use('/gateway/search', createProxyMiddleware({
    target: SEARCH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/gateway/search': '', 
    },
}));

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
