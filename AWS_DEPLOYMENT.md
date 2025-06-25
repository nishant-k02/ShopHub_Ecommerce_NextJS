# AWS Deployment Guide for Ecommerce Application

This guide covers multiple deployment options for your Next.js ecommerce application on AWS.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **MongoDB Atlas**: Your database should be set up and accessible
3. **Domain Name** (Optional): For custom domain setup
4. **AWS CLI** (Optional): For command-line deployments

## Environment Variables

Before deploying, ensure you have these environment variables configured:

```bash
MONGODB_URI=mongodb_credentials
MONGODB_DB_NAME=ecommerce
```

## Deployment Options

### Option 1: AWS Amplify (Recommended)

**Best for**: Quick deployment with automatic CI/CD

#### Steps:

1. **Install AWS Amplify CLI** (optional):
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Connect to AWS Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository (GitHub, GitLab, Bitbucket)

3. **Configure Build Settings**:
   - The `amplify.yml` file is already configured
   - Add environment variables in Amplify Console:
     - `MONGODB_URI`
     - `MONGODB_DB_NAME`

4. **Deploy**:
   - Amplify will automatically build and deploy your app
   - You'll get a URL like: `https://main.xxxxx.amplifyapp.com`

#### Benefits:
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Built-in CDN and SSL
- ✅ Easy environment variable management

### Option 2: AWS ECS with Fargate

**Best for**: Containerized deployment with auto-scaling

#### Steps:

1. **Build and Push Docker Image**:
   ```bash
   # Build the image
   docker build -t ecommerce-app .
   
   # Tag for ECR
   docker tag ecommerce-app:latest YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/ecommerce-app:latest
   
   # Push to ECR
   aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
   docker push YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/ecommerce-app:latest
   ```

2. **Create ECS Cluster and Service**:
   - Use AWS Console or CloudFormation
   - Configure environment variables
   - Set up load balancer

3. **Configure Auto Scaling**:
   - Set minimum and maximum tasks
   - Configure scaling policies

### Option 3: AWS Elastic Beanstalk

**Best for**: Traditional web application deployment

#### Steps:

1. **Create Application**:
   ```bash
   # Install EB CLI
   pip install awsebcli
   
   # Initialize EB application
   eb init ecommerce-app --platform node.js --region us-east-1
   ```

2. **Configure Environment**:
   ```bash
   eb create ecommerce-production
   ```

3. **Set Environment Variables**:
   ```bash
   eb setenv MONGODB_URI="your_mongodb_uri" MONGODB_DB_NAME="ecommerce"
   ```

4. **Deploy**:
   ```bash
   eb deploy
   ```

### Option 4: AWS EC2

**Best for**: Full control over the server

#### Steps:

1. **Launch EC2 Instance**:
   - Use Amazon Linux 2 or Ubuntu
   - Configure security groups (port 3000, 80, 443)

2. **Install Dependencies**:
   ```bash
   # Update system
   sudo yum update -y  # Amazon Linux
   # or
   sudo apt update && sudo apt upgrade -y  # Ubuntu
   
   # Install Node.js
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

3. **Deploy Application**:
   ```bash
   # Clone your repository
   git clone YOUR_REPO_URL
   cd ecommerce
   
   # Install dependencies
   npm ci --production
   
   # Build the application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "ecommerce" -- start
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx** (Optional):
   ```bash
   # Install Nginx
   sudo yum install nginx -y
   
   # Configure reverse proxy
   sudo nano /etc/nginx/conf.d/ecommerce.conf
   ```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to git
2. **Security Groups**: Only open necessary ports
3. **HTTPS**: Always use SSL/TLS in production
4. **Database Security**: Use VPC and security groups for database access

## Monitoring and Logging

1. **CloudWatch**: Monitor application metrics and logs
2. **X-Ray**: Trace requests for debugging
3. **Health Checks**: Configure proper health check endpoints

## Cost Optimization

1. **Use Reserved Instances** for predictable workloads
2. **Enable Auto Scaling** to handle traffic spikes
3. **Use Spot Instances** for non-critical workloads
4. **Monitor CloudWatch** for cost optimization opportunities

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs in Amplify Console

2. **Database Connection Issues**:
   - Verify MongoDB Atlas network access
   - Check environment variables
   - Ensure proper connection string format

3. **Performance Issues**:
   - Enable Next.js caching
   - Use CDN for static assets
   - Optimize images and bundle size

## Next Steps

1. Choose your preferred deployment method
2. Set up your MongoDB Atlas database
3. Configure environment variables
4. Deploy and test your application
5. Set up monitoring and logging
6. Configure custom domain (optional)

## Support

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment) 