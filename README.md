# DotnetWebApiScaffolder

When building web applications I spent a lot of time writing the same repetitive code. Every entity needs a repository, a model, a controller with CRUD operations etc.

Writing this type of code is boring so I decided to write a code generator that can be used to generate all the boring code for me.

With this tool you can define the data model as code and the tool will produce all the code to define odata endpoints for each entity.

## Development stage

I only recently started so not everything is implemented yet.
Currently you can generate:

- Repositories
- Database context
- Models
- DTOs
- Odata Controllers
- TypeScript types

In the future I also want to add authentication and authorization.

## Usage

Following steps should get you started:

1. Install NPM package (Not yet published to NPM)

```bash
npm install WernerLDev/DotnetWebApiScaffolder#main
```

2. Create a project file

```TypeScript
const testProject: TsScaffolder = new TsScaffolder({
  basePath: "../",
  dbContextName: "TestDbContext",
  projectName: "TestApi",
});

testProject
  .addGenerator(OdataGenerator)
  .addGenerator(ModelsGenerator)
  .addGenerator(DbContextGenerator)
  .addGenerator(TypeScriptTypesGenerator)
  .addGenerator(OdataModelBuilderGenerator)
  .addGenerator(DtosGenerator)
  .addGenerator(RepositoryGenerator)
  .addGenerator(ServiceExtensionGenerator)
  .addEntity({
    name: "Test",
    columns: [{ name: "Name", type: "string" }],
  })
  .addEntity({
    name: "User",
    columns: [
      { name: "Firstname", type: "string" },
      { name: "Lastname", type: "string" },
      { name: "DateOfBirth", type: "datetime" },
    ],
    relations: [{ has: "one", target: "Test" }],
  })
  .generate();
```

3. Run the generator

```bash
npx ts-node testProject.ts
```

## Create own generator

If you want to create your own generator you can simply implement a function with the following signature:

```TypeScript
type Generator = (entities: Entity[], metaData: ProjectMeta) => void;
```
