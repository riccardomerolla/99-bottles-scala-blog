# 99 Bottles Scala: Project Blueprint & Implementation Guide

## Project Overview

Transform Sandy Metz's "99 Bottles of OOP" into a comprehensive exploration of functional programming (FP) and effect-oriented programming using Scala 3.x and ZIO 2.x. This project will demonstrate how object-oriented design principles translate and evolve in functional paradigms.

### Core Objectives
- **Educational**: Bridge OOP concepts to FP/Effect-oriented programming
- **Practical**: Provide working, tested, formatted code examples
- **Automated**: Fully automated content generation, validation, and publishing
- **Engaging**: Regular social media content to build community

## Architecture Overview

```
99-bottles-scala/
├── book/                          # Markdown chapters
├── code/                          # All Scala implementations
│   ├── functional/               # Pure FP versions
│   ├── zio/                     # ZIO effect-oriented versions
│   └── common/                  # Shared utilities
├── posts/                        # Social media content
├── scripts/                      # Ruby automation scripts
├── .github/workflows/           # GitHub Actions
├── n8n/                         # N8N workflow definitions
└── tools/                       # Build and formatting tools
```

## Implementation Plan

### Phase 1: Foundation Setup (Weeks 1-2)

#### Repository Structure
```ruby
# scripts/setup_project.rb
# GitHub Copilot: Create a Ruby script to initialize the project structure
```

**Required Directories:**
- `/book/chapters/` - Individual chapter markdown files
- `/code/functional/` - Pure functional Scala implementations
- `/code/zio/` - ZIO-based effect implementations
- `/code/common/` - Shared type definitions and utilities
- `/posts/twitter/` - X.com content templates
- `/posts/linkedin/` - LinkedIn article templates
- `/scripts/` - Ruby automation scripts
- `/.github/workflows/` - CI/CD automation
- `/n8n/workflows/` - N8N agent definitions

#### Core Dependencies (build.sbt)
```scala
// GitHub Copilot: Configure Scala 3.x project with ZIO 2.x dependencies
scalaVersion := "3.3.1"

libraryDependencies ++= Seq(
  "dev.zio" %% "zio" % "2.0.15",
  "dev.zio" %% "zio-test" % "2.0.15" % Test,
  "dev.zio" %% "zio-test-sbt" % "2.0.15" % Test,
  "org.typelevel" %% "cats-core" % "2.9.0",
  "org.typelevel" %% "cats-effect" % "3.5.1",
  "org.scalatest" %% "scalatest" % "3.2.16" % Test
)
```

#### Code Quality Setup
```scala
// project/plugins.sbt
// GitHub Copilot: Configure scalafmt, scalafix, and wartremover plugins
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.0")
addSbtPlugin("ch.epfl.scala" % "sbt-scalafix" % "0.11.0")
addSbtPlugin("org.wartremover" % "sbt-wartremover" % "3.1.3")
```

### Phase 2: Content Framework (Weeks 3-4)

#### Chapter Template System
```ruby
# scripts/chapter_generator.rb
# GitHub Copilot: Create a Ruby script that generates chapter templates
# with embedded code extraction markers
```

**Chapter Template Structure:**
```markdown
# Chapter X: [Title]

## Concept Overview
Brief introduction connecting to Sandy Metz's original concept.

## Object-Oriented Approach (Reference)
```ruby
# Original Ruby code from Sandy Metz's book
```

## Functional Approach
```scala
// @source: code/functional/chapterX/implementation.scala
// GitHub Copilot will extract this code block automatically
```

## Effect-Oriented Approach (ZIO)
```scala
// @source: code/zio/chapterX/implementation.scala  
// GitHub Copilot will extract this code block automatically
```

## Key Insights
- Comparison points
- Trade-offs
- When to use each approach
```

#### Code Extraction System
```ruby
# scripts/code_extractor.rb  
# GitHub Copilot: Create a Ruby script that:
# 1. Scans markdown files for @source annotations
# 2. Extracts corresponding code from Scala files
# 3. Updates markdown with latest code
# 4. Validates code compiles and passes tests
```

### Phase 3: Core Content Development (Weeks 5-12)

#### Chapter Progression Map

**Chapter 1: The 99 Bottles Problem**
- **Functional**: Pure functions, immutable data
- **ZIO**: Effect description, resource safety
- **Key Concepts**: Purity, referential transparency

**Chapter 2: Test-Driven Development**
- **Functional**: Property-based testing with ScalaCheck
- **ZIO**: ZIO Test framework, effect testing patterns
- **Key Concepts**: Testability in FP contexts

**Chapter 3: Unearthing Concepts**
- **Functional**: Algebraic data types, pattern matching
- **ZIO**: Error handling with ZIO failures
- **Key Concepts**: Making illegal states unrepresentable

**Chapter 4: Extracting Classes → Extracting Functions**
- **Functional**: Function composition, higher-order functions
- **ZIO**: ZIO combinators, effect composition
- **Key Concepts**: Compositionality

**Chapter 5: Separating Responsibilities → Separating Effects**
- **Functional**: Reader monad, dependency injection
- **ZIO**: ZLayer, environment provision
- **Key Concepts**: Effect separation

**Chapter 6: Achieving Openness → Achieving Extensibility**
- **Functional**: Type classes, ad-hoc polymorphism
- **ZIO**: ZIO environment, modular effects
- **Key Concepts**: Open/closed principle in FP

#### Implementation Guidelines for Each Chapter

```scala
// GitHub Copilot: For each chapter, create three implementations:

// 1. Pure Functional Version
package bottles.functional.chapter1

// Use immutable data structures
// Emphasize function composition
// Leverage Scala 3 features (union types, given/using)

// 2. ZIO Version  
package bottles.zio.chapter1

// Model side effects explicitly
// Use ZIO environment for dependencies
// Emphasize resource safety and error handling

// 3. Shared Types
package bottles.common

// Common domain types used across implementations
// ADTs representing the problem domain
```

### Phase 4: Automation Pipeline (Weeks 6-8, parallel with content)

#### GitHub Actions Workflow
```yaml
# .github/workflows/content-pipeline.yml
# GitHub Copilot: Create a comprehensive CI/CD pipeline that:
# 1. Runs on every push and PR
# 2. Compiles all Scala code
# 3. Runs all tests
# 4. Formats code with scalafmt
# 5. Extracts code into markdown
# 6. Validates markdown links and formatting
# 7. Generates social media content
# 8. Deploys to GitHub Pages (optional)

name: Content Pipeline
on: [push, pull_request, schedule]
jobs:
  validate-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: coursier/setup-action@v1
        with:
          jvm: temurin:17
      - name: Compile and test Scala code
      - name: Format code with scalafmt  
      - name: Extract code to markdown
      - name: Validate content
      - name: Generate social posts
```

#### Ruby Automation Scripts

```ruby
# scripts/content_processor.rb
# GitHub Copilot: Create a Ruby script that:
# 1. Processes all chapters
# 2. Extracts and validates code
# 3. Generates table of contents
# 4. Creates cross-references
# 5. Validates internal links

# scripts/social_media_generator.rb  
# GitHub Copilot: Create a Ruby script that:
# 1. Extracts key insights from chapters
# 2. Creates Twitter-sized code snippets
# 3. Generates LinkedIn article previews
# 4. Creates engagement questions
# 5. Schedules content calendar
```

### Phase 5: N8N AI Agent Integration (Weeks 9-10)

#### N8N Workflow Architecture
```json
{
  "name": "Content Review and Publishing Agent",
  "nodes": [
    {
      "name": "GitHub Trigger",
      "type": "@n8n/nodes-github-trigger"
    },
    {
      "name": "Content Analyzer",
      "type": "@n8n/nodes-openai"
    },
    {
      "name": "Quality Reviewer", 
      "type": "@n8n/nodes-openai"
    },
    {
      "name": "Social Media Generator",
      "type": "@n8n/nodes-openai"
    },
    {
      "name": "Publishing Scheduler",
      "type": "@n8n/nodes-schedule"
    }
  ]
}
```

#### AI Agent Prompts
```ruby
# scripts/ai_prompts.rb
# GitHub Copilot: Define structured prompts for:

CONTENT_REVIEW_PROMPT = <<~PROMPT
  Review this Scala code and chapter content for:
  1. Technical accuracy
  2. Clarity of functional programming concepts
  3. Proper ZIO usage patterns
  4. Educational value
  5. Connection to original OOP concepts
PROMPT

SOCIAL_MEDIA_PROMPT = <<~PROMPT  
  Generate engaging social media content from this chapter:
  1. Twitter thread (5-7 tweets) highlighting key insights
  2. LinkedIn post with code example and discussion points
  3. Relevant hashtags for Scala/FP community
  4. Call-to-action for engagement
PROMPT
```

### Phase 6: Social Media Strategy (Ongoing)

#### Content Calendar Template
```ruby
# scripts/content_calendar.rb
# GitHub Copilot: Create a system that:
# 1. Generates weekly content themes
# 2. Balances educational and engaging content
# 3. Coordinates with chapter releases
# 4. Tracks engagement metrics
# 5. Suggests optimal posting times
```

#### Content Types
- **Code Snippets**: Before/after transformations (OOP → FP)
- **Concept Explainers**: Visual diagrams of functional concepts
- **Challenge Posts**: "How would you implement this functionally?"
- **Community Engagement**: Questions about FP experiences
- **Progress Updates**: Book development milestones

## Technical Implementation Details

### Code Organization Patterns

```scala
// GitHub Copilot: Implement consistent patterns across all chapters

// 1. Domain modeling with ADTs
enum BottleCount:
  case Empty
  case Remaining(count: Int)

// 2. Pure functional core
trait BottleSong[F[_]]:
  def verse(n: Int): F[String]
  def song(from: Int, to: Int): F[String]

// 3. ZIO implementation
object BottleSongZIO extends BottleSong[ZIO[Any, Nothing, *]]:
  def verse(n: Int): ZIO[Any, Nothing, String] = 
    ZIO.succeed(generateVerse(n))
```

### Testing Strategy
```scala
// GitHub Copilot: Implement comprehensive testing for each approach

// Property-based tests
property("song verses decrease monotonically") {
  forAll(Gen.choose(1, 99)) { n =>
    // Test implementation
  }
}

// ZIO tests  
test("bottle song handles edge cases") {
  for {
    emptyVerse <- BottleSongZIO.verse(0)
    lastVerse <- BottleSongZIO.verse(1)
  } yield assertTrue(
    emptyVerse.contains("no more bottles"),
    lastVerse.contains("1 bottle")
  )
}
```

### Documentation Standards
```scala
// GitHub Copilot: Follow consistent documentation patterns

/** Generates a verse of the 99 bottles song.
  *
  * This pure functional implementation demonstrates:
  * - Immutable data handling
  * - Pattern matching on ADTs  
  * - Referential transparency
  *
  * @param count The number of bottles (0-99)
  * @return A verse string
  * @example {{{
  * verse(99) // "99 bottles of beer on the wall..."
  * }}}
  */
def verse(count: BottleCount): String = ???
```

## Quality Assurance Checklist

### Code Quality Gates
- [ ] All Scala code compiles without warnings
- [ ] 100% test coverage for core logic
- [ ] Scalafmt formatting applied consistently
- [ ] Scalafix rules enforced
- [ ] No wartremover violations

### Content Quality Gates  
- [ ] All code examples extracted from source files
- [ ] Code examples compile and run
- [ ] Markdown formatting validated
- [ ] Internal links verified
- [ ] Social media previews generated

### Automation Health Checks
- [ ] GitHub Actions pipeline success
- [ ] N8N workflows operational
- [ ] Ruby scripts error-free
- [ ] AI agent responses validated

## Success Metrics

### Engagement Metrics
- GitHub stars and forks growth
- Social media engagement rates
- Community contributions (issues, PRs)
- Content sharing and mentions

### Educational Impact
- Code example adoption in community projects
- Referenced in other educational content
- Speaking opportunities and conference mentions
- Translation requests or adaptations

### Technical Excellence
- Zero compilation errors maintained
- Consistent code quality scores
- Automated pipeline reliability (>99% success rate)
- Fast content delivery (commits to publish <10 minutes)

## Timeline and Milestones

### Month 1: Foundation
- Week 1-2: Repository setup and tooling
- Week 3-4: Chapter template system and automation

### Month 2-3: Core Content  
- Week 5-8: Chapters 1-3 complete with implementations
- Week 9-12: Chapters 4-6 complete with implementations

### Month 4: Polish and Launch
- Week 13-14: Content review and refinement
- Week 15-16: Social media campaign launch

### Ongoing: Community Building
- Weekly content publication
- Monthly community feedback integration
- Quarterly content updates and improvements

## GitHub Copilot Integration Points

This blueprint is structured to maximize GitHub Copilot effectiveness:

1. **Clear Intent Comments**: Every code section includes specific instructions for Copilot
2. **Consistent Patterns**: Repeated structures help Copilot understand project conventions
3. **Explicit Requirements**: Detailed specifications for each component
4. **Context Preservation**: Related code organized together for better suggestions
5. **Documentation Standards**: Consistent doc patterns help Copilot generate appropriate documentation

Use this blueprint as a living document - update it as the project evolves and new insights emerge from the functional programming exploration of Sandy Metz's concepts.