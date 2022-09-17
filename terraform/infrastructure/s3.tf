resource "aws_s3_bucket" "client_bucket" {
  bucket        = var.domain_name
  force_destroy = true
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.client_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.client_bucket.id

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
}

resource "aws_s3_bucket_website_configuration" "bucket_website" {
  bucket = aws_s3_bucket.client_bucket.id

  index_document {
    suffix = "index.html"
  }
}
