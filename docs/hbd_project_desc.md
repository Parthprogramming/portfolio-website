### Overview

* Developed a multi-layer Human Bot Detection system designed to distinguish genuine users from automated bots without relying on traditional CAPTCHAs.
* Built a probabilistic verification pipeline that evaluates user authenticity through Behavioral Analysis, Network Analysis, Browser Integrity Validation, and Temporal Consistency monitoring.
* Designed a secure Site Key and Secret Key verification architecture, enabling websites to securely integrate with the detection service while preventing unauthorized verification requests.
* Implemented a behavioral tracking SDK capable of collecting and analyzing 90+ browser, interaction, and behavioral signals without impacting the user experience.
* Developed a risk-based decision engine that combines evidence from multiple detection layers to generate trust scores, risk scores, and recommended actions.
* Focused on reducing false positives while maintaining strong protection against automated abuse, bots, and scripted browser automation.


### Why It was Built : 

* Traditional bot protection mechanisms often rely on CAPTCHAs, static rules, or single-point verification checks that can negatively impact user experience.
* Modern automation frameworks are increasingly capable of bypassing conventional bot detection techniques, reducing their effectiveness.
* The project was built to explore a more intelligent and user-friendly approach to human verification using behavioral intelligence, browser integrity signals, and long-term interaction patterns.
* Designed to silently evaluate trust over time instead of making decisions based on a single interaction or request.
* Focused on minimizing false positives while maintaining strong protection against automated abuse.
* Aimed to provide organizations with a scalable verification system that enhances security without disrupting legitimate users.


### Architecture : 
hbd-arch in public folder . 

### Tech Stack : 
Frontend
React.js

Behavioral Tracking
Custom JavaScript SDK


Backend
Django REST Framework

Database
PostgreSQL

Machine Learning
XGBoost
Random Forest
Logistic Regression
Scikit-Learn


Infrastructure
Cloudflare Pages
REST APIs


### Engineering Challenges & Solutions

1. Reducing False Positives Through Multi-Layer Detection

**Challenge:**

* The initial system relied solely on a machine learning model to classify users as human or bot.
* Limited training data and a single-layer decision process resulted in a high number of false positives.
* Legitimate users could occasionally be flagged as bots due to insufficient verification mechanisms.

**Approach Taken:**

* Redesigned the architecture into a multi-layer detection framework.
* Introduced Network Analysis, Browser Integrity Validation, and Temporal Consistency layers alongside Behavioral Analysis.
* Implemented rule-based gating to identify impossible or highly suspicious conditions before producing a final verdict.

**Result:**

* Significantly reduced false positives.
* Improved classification reliability and confidence.
* Enabled decisions to be based on multiple independent signals rather than a single ML prediction.


2. Balancing Detection Accuracy During Backend Logic Changes

**Challenge:**

* Introducing new behavioral metrics, thresholds, or detection rules often affected the overall classification accuracy.
* Small changes in backend decision logic sometimes increased false positives, causing legitimate users to be classified incorrectly.
* The interaction between multiple detection signals made it difficult to predict the impact of new rules.

**Approach Taken:**

* Continuously tested the system against known human and bot behavior patterns.
* Performed iterative threshold tuning and rule adjustments based on observed results.
* Monitored classification outcomes after each change to identify regressions.

**Key Learning:**

* More detection signals do not always lead to better results.
* Detection systems require careful balancing of rules and thresholds, as even minor changes can significantly affect overall accuracy.


