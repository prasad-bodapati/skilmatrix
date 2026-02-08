package com.skillmatrix.config;

import com.skillmatrix.entity.*;
import com.skillmatrix.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final AppUserRepository userRepo;
    private final TeamRepository teamRepo;
    private final ProjectRepository projectRepo;
    private final ComponentRepository componentRepo;
    private final QuestionRepository questionRepo;
    private final AssessmentRepository assessmentRepo;
    private final AssessmentInviteRepository inviteRepo;
    private final AssessmentAttemptRepository attemptRepo;
    private final DeveloperLevelRepository levelRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AppUserRepository userRepo, TeamRepository teamRepo, ProjectRepository projectRepo,
                      ComponentRepository componentRepo, QuestionRepository questionRepo,
                      AssessmentRepository assessmentRepo, AssessmentInviteRepository inviteRepo,
                      AssessmentAttemptRepository attemptRepo, DeveloperLevelRepository levelRepo,
                      PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.teamRepo = teamRepo;
        this.projectRepo = projectRepo;
        this.componentRepo = componentRepo;
        this.questionRepo = questionRepo;
        this.assessmentRepo = assessmentRepo;
        this.inviteRepo = inviteRepo;
        this.attemptRepo = attemptRepo;
        this.levelRepo = levelRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        AppUser root = createUser("admin@skillmatrix.com", "Sarah Chen", AppUser.Role.ROOT);
        AppUser admin1 = createUser("james@skillmatrix.com", "James Wilson", AppUser.Role.TEAM_ADMIN);
        AppUser admin2 = createUser("maria@skillmatrix.com", "Maria Garcia", AppUser.Role.TEAM_ADMIN);
        AppUser dev1 = createUser("alex@skillmatrix.com", "Alex Johnson", AppUser.Role.DEVELOPER);
        AppUser dev2 = createUser("priya@skillmatrix.com", "Priya Patel", AppUser.Role.DEVELOPER);
        AppUser dev3 = createUser("mike@skillmatrix.com", "Mike Thompson", AppUser.Role.DEVELOPER);
        AppUser dev4 = createUser("emily@skillmatrix.com", "Emily Davis", AppUser.Role.DEVELOPER);
        AppUser dev5 = createUser("raj@skillmatrix.com", "Raj Kumar", AppUser.Role.DEVELOPER);

        Team platformTeam = createTeam("Platform Engineering", "Core platform and infrastructure team");
        Team productTeam = createTeam("Product Development", "Customer-facing product development");
        Team dataTeam = createTeam("Data & Analytics", "Data pipeline and analytics team");

        Project ecommerce = createProject("E-Commerce Platform", "Main e-commerce web application", platformTeam);
        Project mobileApp = createProject("Mobile App", "iOS and Android mobile application", productTeam);
        Project datapipeline = createProject("Data Pipeline", "ETL and analytics data pipeline", dataTeam);
        Project authService = createProject("Auth Service", "Authentication & authorization microservice", platformTeam);

        com.skillmatrix.entity.Component javaBackend = createComponent("Java Backend", "Java", "Spring Boot backend services", ecommerce);
        com.skillmatrix.entity.Component reactFrontend = createComponent("React Frontend", "React", "React TypeScript frontend", ecommerce);
        com.skillmatrix.entity.Component postgresDb = createComponent("PostgreSQL DB", "PostgreSQL", "Database layer and migrations", ecommerce);
        com.skillmatrix.entity.Component reactNative = createComponent("React Native", "React Native", "Mobile app frontend", mobileApp);
        com.skillmatrix.entity.Component nodeApi = createComponent("Node.js API", "Node.js", "Mobile backend API", mobileApp);
        com.skillmatrix.entity.Component pythonEtl = createComponent("Python ETL", "Python", "Data extraction and loading", datapipeline);
        com.skillmatrix.entity.Component sparkAnalytics = createComponent("Spark Analytics", "Apache Spark", "Data processing and analytics", datapipeline);
        com.skillmatrix.entity.Component springAuth = createComponent("Spring Security", "Java", "Authentication service", authService);

        seedJavaQuestions(javaBackend);
        seedReactQuestions(reactFrontend);
        seedPostgresQuestions(postgresDb);
        seedNodeQuestions(nodeApi);
        seedPythonQuestions(pythonEtl);

        seedAssessmentsAndAttempts(javaBackend, reactFrontend, postgresDb, nodeApi, pythonEtl,
                admin1, dev1, dev2, dev3, dev4, dev5);
    }

    private AppUser createUser(String email, String fullName, AppUser.Role role) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setEmailVerified(true);
        user.setSecurityQuestion("What is your favorite color?");
        user.setSecurityAnswer(passwordEncoder.encode("blue"));
        return userRepo.save(user);
    }

    private Team createTeam(String name, String description) {
        Team team = new Team();
        team.setName(name);
        team.setDescription(description);
        return teamRepo.save(team);
    }

    private Project createProject(String name, String description, Team team) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setTeam(team);
        return projectRepo.save(project);
    }

    private com.skillmatrix.entity.Component createComponent(String name, String techStack, String description, Project project) {
        com.skillmatrix.entity.Component component = new com.skillmatrix.entity.Component();
        component.setName(name);
        component.setTechStack(techStack);
        component.setDescription(description);
        component.setProject(project);
        return componentRepo.save(component);
    }

    private void seedJavaQuestions(com.skillmatrix.entity.Component comp) {
        createMCQ(comp, 1, "What is the default value of an int in Java?", Arrays.asList("0", "null", "1", "undefined"), "0");
        createMCQ(comp, 1, "Which keyword is used to create a class in Java?", Arrays.asList("class", "struct", "def", "new"), "class");
        createMCQ(comp, 2, "What is method overloading?", Arrays.asList("Same method name, different parameters", "Overriding a parent method", "Creating a new method", "Deleting a method"), "Same method name, different parameters");
        createMCQ(comp, 2, "Which collection allows duplicate elements?", Arrays.asList("List", "Set", "Map", "None"), "List");
        createMCQ(comp, 3, "What annotation marks a Spring Boot main class?", Arrays.asList("@SpringBootApplication", "@Component", "@Service", "@Entity"), "@SpringBootApplication");
        createMCQ(comp, 3, "What does @Autowired do?", Arrays.asList("Dependency injection", "Create new instance", "Define a bean", "Start transaction"), "Dependency injection");
        createMCQ(comp, 4, "What is the purpose of @Transactional?", Arrays.asList("Manage database transactions", "Create REST endpoints", "Validate input", "Enable caching"), "Manage database transactions");
        createMCQ(comp, 5, "Which design pattern does Spring use for AOP?", Arrays.asList("Proxy", "Singleton", "Factory", "Observer"), "Proxy");
        createFIB(comp, 5, "The JPA annotation to map a class to a database table is ___", "@Entity");
        createMCQ(comp, 6, "What is the N+1 select problem in JPA?", Arrays.asList("Lazy loading causes extra queries", "Too many joins", "Missing indexes", "Connection pool exhaustion"), "Lazy loading causes extra queries");
        createFIB(comp, 7, "In Spring Security, the interface for loading user details is ___", "UserDetailsService");
        createMCQ(comp, 8, "What garbage collector is recommended for low-latency Java apps?", Arrays.asList("ZGC", "G1GC", "Serial GC", "CMS"), "ZGC");
        createMCQ(comp, 9, "What is Project Loom primarily about?", Arrays.asList("Virtual threads", "Value types", "Pattern matching", "Foreign functions"), "Virtual threads");
        createFIB(comp, 10, "The Spring annotation for defining a custom query is ___", "@Query");
    }

    private void seedReactQuestions(com.skillmatrix.entity.Component comp) {
        createMCQ(comp, 1, "What is JSX?", Arrays.asList("JavaScript XML syntax extension", "Java Server Extension", "JSON XML Schema", "JavaScript Extra"), "JavaScript XML syntax extension");
        createMCQ(comp, 1, "Which hook is used for state management?", Arrays.asList("useState", "useEffect", "useContext", "useRef"), "useState");
        createMCQ(comp, 2, "What does useEffect do?", Arrays.asList("Handle side effects", "Manage state", "Create context", "Optimize rendering"), "Handle side effects");
        createMCQ(comp, 3, "What is the Virtual DOM?", Arrays.asList("Lightweight copy of actual DOM", "Server-side DOM", "Browser API", "CSS framework"), "Lightweight copy of actual DOM");
        createMCQ(comp, 4, "What is React.memo used for?", Arrays.asList("Memoize component to prevent re-renders", "Create memos", "Store data", "Manage memory"), "Memoize component to prevent re-renders");
        createFIB(comp, 5, "The hook for memoizing expensive calculations is ___", "useMemo");
        createMCQ(comp, 6, "What is code splitting in React?", Arrays.asList("Loading components on demand", "Splitting CSS files", "Dividing state", "Multiple render trees"), "Loading components on demand");
        createMCQ(comp, 7, "What is a Higher Order Component?", Arrays.asList("A function that takes a component and returns enhanced component", "A parent component", "A styled component", "A form component"), "A function that takes a component and returns enhanced component");
        createFIB(comp, 8, "The React hook for imperative handle is ___", "useImperativeHandle");
        createMCQ(comp, 9, "What is React Suspense for?", Arrays.asList("Handle async operations in render", "Pause execution", "Stop rendering", "Cache data"), "Handle async operations in render");
    }

    private void seedPostgresQuestions(com.skillmatrix.entity.Component comp) {
        createMCQ(comp, 1, "What type of database is PostgreSQL?", Arrays.asList("Relational", "Document", "Graph", "Key-Value"), "Relational");
        createMCQ(comp, 2, "What is a PRIMARY KEY?", Arrays.asList("Unique identifier for a row", "Foreign reference", "Index type", "Table name"), "Unique identifier for a row");
        createMCQ(comp, 3, "What does INNER JOIN do?", Arrays.asList("Returns matching rows from both tables", "Returns all rows", "Deletes rows", "Creates index"), "Returns matching rows from both tables");
        createMCQ(comp, 4, "What is a database index?", Arrays.asList("Data structure to speed up queries", "A table column", "A backup method", "A schema type"), "Data structure to speed up queries");
        createFIB(comp, 5, "The PostgreSQL command to analyze query performance is ___", "EXPLAIN ANALYZE");
        createMCQ(comp, 6, "What is a CTE in SQL?", Arrays.asList("Common Table Expression", "Create Table Expression", "Column Type Extension", "Cache Table Entry"), "Common Table Expression");
        createMCQ(comp, 7, "What isolation level prevents phantom reads?", Arrays.asList("SERIALIZABLE", "READ COMMITTED", "READ UNCOMMITTED", "REPEATABLE READ"), "SERIALIZABLE");
    }

    private void seedNodeQuestions(com.skillmatrix.entity.Component comp) {
        createMCQ(comp, 1, "What runtime does Node.js use?", Arrays.asList("V8", "SpiderMonkey", "Chakra", "JavaScriptCore"), "V8");
        createMCQ(comp, 2, "What is npm?", Arrays.asList("Node Package Manager", "New Programming Module", "Network Protocol Manager", "Node Process Monitor"), "Node Package Manager");
        createMCQ(comp, 3, "What is Express.js?", Arrays.asList("Web framework for Node.js", "Database ORM", "Testing library", "Build tool"), "Web framework for Node.js");
        createMCQ(comp, 4, "What is middleware in Express?", Arrays.asList("Functions that access request/response cycle", "Database layer", "Frontend code", "Configuration files"), "Functions that access request/response cycle");
        createFIB(comp, 5, "The Node.js module for file system operations is ___", "fs");
        createMCQ(comp, 6, "What is the event loop?", Arrays.asList("Mechanism for handling async operations", "A for loop", "Error handler", "Memory manager"), "Mechanism for handling async operations");
    }

    private void seedPythonQuestions(com.skillmatrix.entity.Component comp) {
        createMCQ(comp, 1, "What is Python primarily known for?", Arrays.asList("Readability and simplicity", "Speed", "Static typing", "Compilation"), "Readability and simplicity");
        createMCQ(comp, 2, "What is a list comprehension?", Arrays.asList("Concise way to create lists", "A data type", "An import statement", "A class definition"), "Concise way to create lists");
        createMCQ(comp, 3, "What is pandas used for?", Arrays.asList("Data manipulation and analysis", "Web development", "Game development", "Machine learning"), "Data manipulation and analysis");
        createFIB(comp, 4, "The Python library for numerical computing is ___", "numpy");
        createMCQ(comp, 5, "What is a decorator in Python?", Arrays.asList("Function that modifies another function", "A design pattern", "An import type", "A variable"), "Function that modifies another function");
    }

    private void createMCQ(com.skillmatrix.entity.Component comp, int level, String text, List<String> options, String answer) {
        Question q = new Question();
        q.setComponent(comp);
        q.setDifficultyLevel(level);
        q.setQuestionText(text);
        q.setType(Question.QuestionType.MCQ);
        q.setOptions(options);
        q.setCorrectAnswer(answer);
        questionRepo.save(q);
    }

    private void createFIB(com.skillmatrix.entity.Component comp, int level, String text, String answer) {
        Question q = new Question();
        q.setComponent(comp);
        q.setDifficultyLevel(level);
        q.setQuestionText(text);
        q.setType(Question.QuestionType.FILL_IN_BLANK);
        q.setCorrectAnswer(answer);
        questionRepo.save(q);
    }

    private void seedAssessmentsAndAttempts(com.skillmatrix.entity.Component javaComp, com.skillmatrix.entity.Component reactComp,
                                              com.skillmatrix.entity.Component pgComp, com.skillmatrix.entity.Component nodeComp,
                                              com.skillmatrix.entity.Component pythonComp,
                                              AppUser admin, AppUser dev1, AppUser dev2, AppUser dev3, AppUser dev4, AppUser dev5) {
        for (int level = 1; level <= 5; level++) {
            createAssessment(javaComp, level, admin);
            createAssessment(reactComp, level, admin);
            createAssessment(pgComp, level, admin);
            createAssessment(nodeComp, level, admin);
            createAssessment(pythonComp, level, admin);
        }

        createLevelAndAttempts(dev1, javaComp, 5, admin);
        createLevelAndAttempts(dev1, reactComp, 3, admin);
        createLevelAndAttempts(dev1, pgComp, 4, admin);

        createLevelAndAttempts(dev2, javaComp, 7, admin);
        createLevelAndAttempts(dev2, reactComp, 6, admin);
        createLevelAndAttempts(dev2, nodeComp, 4, admin);

        createLevelAndAttempts(dev3, reactComp, 8, admin);
        createLevelAndAttempts(dev3, nodeComp, 5, admin);
        createLevelAndAttempts(dev3, pgComp, 3, admin);

        createLevelAndAttempts(dev4, pythonComp, 6, admin);
        createLevelAndAttempts(dev4, pgComp, 5, admin);
        createLevelAndAttempts(dev4, javaComp, 2, admin);

        createLevelAndAttempts(dev5, javaComp, 4, admin);
        createLevelAndAttempts(dev5, reactComp, 5, admin);
        createLevelAndAttempts(dev5, pythonComp, 3, admin);

        Assessment nextJava = assessmentRepo.findByComponentIdAndLevel(javaComp.getId(), 6).orElse(null);
        if (nextJava == null) {
            nextJava = createAssessment(javaComp, 6, admin);
        }
        createInvite(dev1, nextJava);

        Assessment nextReact = assessmentRepo.findByComponentIdAndLevel(reactComp.getId(), 4).orElse(null);
        if (nextReact == null) {
            nextReact = createAssessment(reactComp, 4, admin);
        }
        createInvite(dev1, nextReact);

        Assessment nextNode = assessmentRepo.findByComponentIdAndLevel(nodeComp.getId(), 6).orElse(null);
        if (nextNode == null) {
            nextNode = createAssessment(nodeComp, 6, admin);
        }
        createInvite(dev3, nextNode);
    }

    private Assessment createAssessment(com.skillmatrix.entity.Component comp, int level, AppUser admin) {
        Assessment a = new Assessment();
        a.setComponent(comp);
        a.setLevel(level);
        a.setPassMarkPercentage(70);
        a.setNumberOfQuestions(5);
        a.setCreatedBy(admin);
        return assessmentRepo.save(a);
    }

    private void createLevelAndAttempts(AppUser dev, com.skillmatrix.entity.Component comp, int maxLevel, AppUser admin) {
        DeveloperLevel dl = new DeveloperLevel();
        dl.setDeveloper(dev);
        dl.setComponent(comp);
        dl.setCurrentLevel(maxLevel);
        dl.setLastLevelUpAt(LocalDateTime.now().minusDays(maxLevel * 5L));
        levelRepo.save(dl);

        for (int lvl = 1; lvl <= maxLevel; lvl++) {
            Assessment assessment = assessmentRepo.findByComponentIdAndLevel(comp.getId(), lvl).orElse(null);
            if (assessment == null) {
                assessment = createAssessment(comp, lvl, admin);
            }

            AssessmentAttempt attempt = new AssessmentAttempt();
            attempt.setDeveloper(dev);
            attempt.setAssessment(assessment);
            attempt.setScore(4 + (lvl % 2));
            attempt.setTotalQuestions(5);
            attempt.setPassed(true);
            attempt.setStatus(AssessmentAttempt.AttemptStatus.GRADED);
            attempt.setStartedAt(LocalDateTime.now().minusDays((maxLevel - lvl + 1) * 7L));
            attempt.setCompletedAt(LocalDateTime.now().minusDays((maxLevel - lvl + 1) * 7L).plusHours(1));
            attemptRepo.save(attempt);
        }
    }

    private void createInvite(AppUser dev, Assessment assessment) {
        AssessmentInvite invite = new AssessmentInvite();
        invite.setDeveloper(dev);
        invite.setAssessment(assessment);
        invite.setStatus(AssessmentInvite.InviteStatus.PENDING);
        inviteRepo.save(invite);
    }
}
