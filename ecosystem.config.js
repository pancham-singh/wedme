module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'WedMe Web App',
      script: '',
      env: {},
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {},
    release: {
      user: 'cuadmin',
      host: '52.40.243.198',
      key: '~/keys/cuapp_rel_master_key.pem',
      ref: 'origin/release',
      repo: 'ssh://git@bitbucket.org/gauravpassi/wedmeweb.git',
      path: '/var/www/html/wedmeweb',
      'post-deploy': 'npm install && npm run build:release',
      env: {
        NODE_ENV: 'release',
        REACT_APP_ENV: 'release',
        I_AM_STUPID: 1
      }
    }
  }
};
