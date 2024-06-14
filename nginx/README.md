# Setting up HTTPS reverse proxy using nginx

## Generate self signed SSL certificate

A sample set of self signed SSL certificate has been provided:

- localhost.key (the private key)
- localhost.crt (the public certificate)

To see what's in the certificate:

```bash
openssl x509 -text -noout -in localhost.crt
```

To generate your own:

```bash
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
```

This command will ask for the following info:

- Country Name (i.e. CA)
- State or Province Name (i.e. Ontario)
- Locality Name (i.e. Markham)
- Organization Name (i.e. LuumiTech)
- Organizational Unit Name (can leave blank)
- Common Name (i.e. localhost, this should reflect the domain of your website)
- Email Address (can leave blank)

This command generates a certificate that will be in x509 container format with SHA256 signature algorithm, 2048bit RSA authentication key and is valid for 365 days.

## Trust authority of the certificate

When browsers get the certificate from server, the authenticity is verified by checking with existing CAs. Browser has a list of trusted CAs by default, if the certificate issuer is not there, then browser will be showing a security warning ‘untrusted connection’.

Our generated certificate is self signed, so browser will give security warning. In order to bypass that, we will manually verify the trust of certificate.

In OSX, you can do that in Keychain access as shown below: (or, open keychain access ui and add cerificate there).

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /path/to/file/localhost.crt
```

## Configure nginx

A sample nginx configuration is stored in `nginx/nginx.conf`. It listens on port 3443.

To start nginx:

```bash
sudo nginx -c /full/path/to/nginx.conf
```

To reload nginx:

```bash
sudo nginx -s reload -c /full/path/to/nginx.conf
```

To stop nginx:

```bash
sudo nginx -s stop
```

## Connecting to nginx

- Start reverse proxy

  ```sh
  cd nginx
  ./start_nginx.sh
  cd ..
  ```

- Point your browser to <https://localhost:3443>
