"""
Preloaded sample resumes and job descriptions for rapid testing and demonstrations.
"""

SAMPLE_RESUMES = {
    "senior_fullstack": {
        "title": "Senior Full Stack Engineer (Alex Chen)",
        "subtitle": "Strong ATS candidate (85%+ score, high metrics, clear structure)",
        "role": "Senior Full Stack Engineer",
        "text": """Alex Chen
Email: alex.chen.dev@gmail.com | Phone: (415) 555-0192
LinkedIn: https://linkedin.com/in/alexchen-tech | GitHub: https://github.com/alexchen-dev | Portfolio: alexchen.dev

SUMMARY
Innovative Senior Full Stack Engineer with 6+ years of experience designing scalable web applications and microservices. Expert in TypeScript, React, Node.js, and cloud native architectures on AWS. Proven track record of boosting system performance by 40% and mentoring 8+ junior and mid-level engineers.

WORK EXPERIENCE
Senior Full Stack Engineer | NovaTech Solutions | San Francisco, CA | 2021 – Present
• Architected and deployed microservices architecture handling 12M+ monthly requests with 99.98% uptime using Node.js, Docker, and Kubernetes on AWS.
• Engineered responsive single-page applications using React, TypeScript, and Tailwind CSS, reducing initial page load times by 45%.
• Spearheaded migration from legacy monolith to PostgreSQL and Redis caching layer, cutting database query latency by 35%.
• Implemented automated CI/CD deployment pipelines using GitHub Actions, decreasing release cycle duration from 4 hours to 15 minutes.
• Mentored a team of 7 engineers across 3 time zones, establishing clean code standards and boosting sprint story point velocity by 25%.

Full Stack Developer | CloudScale Dynamics | Austin, TX | 2018 – 2021
• Developed high-volume RESTful APIs and GraphQL endpoints using Python FastAPI and MongoDB supporting 300K daily active users.
• Optimized frontend bundle sizes by 50% using code splitting, tree shaking, and lazy loading techniques in Webpack.
• Automated end-to-end testing with Jest and Cypress, elevating test coverage from 60% to 92% across all core repositories.
• Collaborated closely with product designers in Figma to build an accessible UI design system conforming to WCAG 2.1 AA standards.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2014 – 2018
GPA: 3.8 / 4.0 | Dean's Honor List

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3, Bash
• Frameworks & Libraries: React, Node.js, Express, Next.js, FastAPI, Redux, Tailwind CSS, GraphQL
• Cloud & DevOps: AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD, GitHub Actions, Linux
• Databases & Caching: PostgreSQL, MongoDB, Redis, Elasticsearch
• Methodologies & Tools: Agile, Scrum, Git, Jira, Postman, Jest, Cypress, Figma

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Certified Kubernetes Application Developer (CKAD) (2022)
"""
    },
    "ai_ml_engineer": {
        "title": "Machine Learning Engineer (Priya Sharma)",
        "subtitle": "High-impact AI/Data candidate (90%+ score, research & production scale)",
        "role": "Machine Learning Engineer",
        "text": """Priya Sharma
Email: priya.sharma.ai@outlook.com | Phone: (650) 555-8391
LinkedIn: https://linkedin.com/in/priyasharma-ml | GitHub: https://github.com/priyasharma-ai

PROFESSIONAL SUMMARY
Machine Learning Engineer with 5+ years of specialized experience in Natural Language Processing (NLP), Large Language Models (LLMs), and scalable machine learning pipelines. Deployed production models serving 50M+ weekly inference requests with low latency.

PROFESSIONAL EXPERIENCE
Senior Machine Learning Engineer | DeepMatrix AI | Palo Alto, CA | 2022 – Present
• Architected enterprise Retrieval-Augmented Generation (RAG) platform using LangChain, Vector Databases, and PyTorch, improving domain retrieval accuracy by 38%.
• Optimized transformer inference latency by 65% through quantization and TensorRT deployment on AWS GPU clusters.
• Engineered distributed ETL pipelines processing 4TB+ daily data streams using Apache Spark, Kafka, and Python.
• Directed model alignment experiments using RLHF and fine-tuning with Hugging Face, reducing hallucination rates by 42%.

Data Scientist & ML Developer | Apex Analytics | New York, NY | 2019 – 2022
• Developed predictive churn and customer segmentation models with Scikit-Learn and XGBoost, saving $1.4M in annual recurring revenue.
• Built automated feature engineering workflows and data validation pipelines in Pandas, NumPy, and Scipy.
• Designed interactive executive dashboards with Tableau and Streamlit, tracking real-time model drift and data anomalies.
• Authored 2 internal machine learning patents and published research on semi-supervised classification algorithms.

EDUCATION
Master of Science in Artificial Intelligence & Data Science
Stanford University | 2017 – 2019
Bachelor of Technology in Computer Engineering
Indian Institute of Technology (IIT) Delhi | 2013 – 2017

SKILLS
• Machine Learning & AI: PyTorch, TensorFlow, Scikit-Learn, NLP, LLM, RAG, Hugging Face, Computer Vision, Deep Learning
• Programming: Python, R, C++, SQL, Bash
• Big Data & Cloud: Apache Spark, Kafka, AWS, Docker, Kubernetes, MLflow
• Databases: PostgreSQL, Pinecone, Redis, BigQuery
• Practices: Agile, CI/CD, Git, MLOps, Data Modeling, Statistical Analysis
"""
    },
    "junior_developer": {
        "title": "Junior Web Developer (Jordan Miller)",
        "subtitle": "Needs improvement (~55% score, passive verbs, lacks metrics - great for testing fixes!)",
        "role": "Junior Web Developer",
        "text": """Jordan Miller
124 Maple Street, Seattle, WA

CAREER OBJECTIVE
A hardworking and motivated self-starter looking for an entry-level software engineer role. I am a team player who thinks outside the box and wants to learn new technologies.

EXPERIENCE
Junior Web Developer | LocalTech Inc | Seattle, WA | 2023 – 2024
• Responsible for working on the company website using HTML, CSS, and JavaScript.
• Helped with frontend bugs and assisted senior developers with various coding tasks.
• Worked on creating forms and connecting to backend REST APIs.
• Duties included attending daily standup meetings and participating in code reviews.
• Handled customer support tickets related to website layout errors.

Intern | Creative Media Agency | Seattle, WA | 2022 – 2023
• Worked on WordPress websites and added plug-ins.
• Helped team members with formatting images and uploading blog posts.
• Assisted in testing mobile responsiveness across different browsers.

EDUCATION
Associate Degree in Web Development
Seattle Community College | 2020 – 2022

SKILLS
HTML, CSS, JavaScript, React, Git, Problem Solving, Communication
"""
    }
}

SAMPLE_JOB_DESCRIPTIONS = {
    "fullstack_fintech": {
        "title": "Senior Full Stack Engineer (FinTech Platform)",
        "company": "Stripe-scale FinTech",
        "text": """Position: Senior Full Stack Engineer
Department: Engineering / Platform

About the Role:
We are looking for an experienced Senior Full Stack Engineer to build next-generation financial infrastructure. You will own mission-critical services handling millions of transactions, work closely with product and design teams, and ensure 99.99% availability.

Key Responsibilities:
• Architect, build, and maintain high-throughput web applications and microservices.
• Develop responsive, performant user interfaces using React, TypeScript, and modern styling libraries like Tailwind CSS.
• Design robust RESTful APIs and GraphQL interfaces using Node.js, Express, or Python FastAPI.
• Deploy scalable containerized services with Docker and Kubernetes on AWS cloud infrastructure.
• Champion CI/CD automation, unit testing (Jest), and rigorous code reviews.
• Collaborate with cross-functional product and design partners in an Agile / Scrum framework.

Qualifications & Requirements:
• 4+ years of professional full stack software development experience.
• Strong proficiency in TypeScript, JavaScript, React, and Node.js.
• Experience with relational databases (PostgreSQL, MySQL) and caching systems (Redis).
• Hands-on experience with AWS, Docker, Kubernetes, and CI/CD pipelines.
• Proven ability to quantify achievements and drive measurable performance optimizations.
• Strong communication, leadership, and problem-solving skills.
"""
    },
    "ml_ai_specialist": {
        "title": "Senior Machine Learning Engineer (Generative AI)",
        "company": "NextGen AI Lab",
        "text": """Position: Senior Machine Learning Engineer (LLM & GenAI)

About the Role:
Join our core AI research and engineering team building production-grade LLM applications, RAG systems, and intelligent multi-agent workflows.

Responsibilities:
• Design, evaluate, and scale production LLM pipelines utilizing LangChain, Vector Databases, and PyTorch.
• Fine-tune foundation models using Hugging Face and RLHF techniques for enterprise customer domains.
• Build real-time streaming data ingestion pipelines using Apache Spark, Kafka, and Python.
• Optimize inference latency and GPU utilization with Docker, Kubernetes, and AWS.
• Collaborate with data engineers and researchers to implement automated MLOps and model monitoring.

Requirements:
• MS or PhD in Computer Science, Data Science, or related quantitative field.
• 3+ years of production experience in Machine Learning, Deep Learning, and NLP.
• Expert proficiency in Python, PyTorch, TensorFlow, and Scikit-Learn.
• Hands-on experience deploying models with Docker, Kubernetes, and AWS.
• Strong background in data modeling, statistical analysis, and linear algebra.
"""
    },
    "frontend_specialist": {
        "title": "Frontend Engineer (React / UI / UX)",
        "company": "Modern Cloud SaaS",
        "text": """Position: Frontend Software Engineer

About the Role:
We are looking for a passionate Frontend Engineer who cares deeply about user experience, pixel-perfect design, accessibility, and high performance.

Responsibilities:
• Build modern, accessible web applications using React, Next.js, and TypeScript.
• Implement modular design systems with Tailwind CSS and Figma specifications.
• Integrate frontend state management with Redux or Zustand and connect with GraphQL / REST APIs.
• Write comprehensive unit and end-to-end tests using Jest, Cypress, or Playwright.
• Optimize Core Web Vitals, page load speeds, and bundle sizes.

Requirements:
• 2+ years of experience with React, JavaScript (ES6+), TypeScript, HTML5, and CSS3.
• Experience working with Figma, Git, and modern CI/CD workflows.
• Understanding of WCAG accessibility standards and responsive design.
• Excellent communication and teamwork skills.
"""
    }
}
