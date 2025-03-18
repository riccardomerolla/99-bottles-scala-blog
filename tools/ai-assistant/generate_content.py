import openai
import os
import argparse
import yaml
from datetime import datetime

# Setup OpenAI client
client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_blog_outline(topic):
    """Generate a blog post outline using OpenAI"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert Scala and ZIO programmer creating outlines for technical blog posts."},
            {"role": "user", "content": f"Create a detailed outline for a blog post about {topic} using Scala and ZIO. Include sections for introduction, main concepts, code examples, and conclusion."}
        ]
    )
    return response.choices[0].message.content

def expand_section(outline, section):
    """Expand a specific section of the outline with more detailed content"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert Scala and ZIO programmer writing detailed technical content."},
            {"role": "user", "content": f"Here is an outline for a blog post:\n\n{outline}\n\nPlease write detailed content for the section: {section}. Include Scala and ZIO code examples where appropriate."}
        ]
    )
    return response.choices[0].message.content

def generate_code_sample(description):
    """Generate a Scala/ZIO code sample based on a description"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert Scala and ZIO programmer. Generate clean, idiomatic Scala code with ZIO."},
            {"role": "user", "content": f"Write a Scala code sample using ZIO for the following functionality:\n{description}\n\nOnly output the code, no explanations."}
        ]
    )
    return response.choices[0].message.content

def create_blog_post(title, topic):
    """Create a full blog post"""
    outline = generate_blog_outline(topic)
    
    # Extract sections using basic parsing (could be improved with better parsing)
    sections = [s.strip() for s in outline.split("\n") if s.strip().startswith("#")]
    
    content = f"""---
title: "{title}"
date: {datetime.now().strftime('%Y-%m-%d')}
tags: ["scala", "zio", "functional-programming"]
excerpt: "An exploration of {topic} using Scala and ZIO"
cover_image: "/images/default-cover.jpg"
series: "99 Bottles of Scala"
---

"""
    
    # Generate content for each section
    for section in sections:
        section_content = expand_section(outline, section)
        content += f"{section}\n\n{section_content}\n\n"
    
    return content

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate blog content with AI")
    parser.add_argument("--title", required=True, help="Blog post title")
    parser.add_argument("--topic", required=True, help="Blog post topic")
    parser.add_argument("--output", required=True, help="Output file path")
    
    args = parser.parse_args()
    
    if not os.environ.get("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY environment variable not set")
        exit(1)