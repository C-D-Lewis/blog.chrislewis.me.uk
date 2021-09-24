resource "aws_s3_bucket" "client_bucket" {
  bucket        = var.domain_name
  acl           = "public-read"
  force_destroy = true

  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${var.domain_name}/*"]
    }
  ]
}
EOF

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_object" "post_history" {
  bucket = var.domain_name
  key    = "assets/postHistory.js"
  source = "../assets/postHistory.js"

  cache_control = "no-cache"

  etag = filemd5("../assets/postHistory.js")
}
