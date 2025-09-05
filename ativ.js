const { Builder, By, until } = require("selenium-webdriver");

async function testLogin(driver, site) {
  try {
    console.log(`\n Testando site: ${site.url}`);
    await driver.get(site.url);

    const userField = await driver.wait(
      until.elementLocated(By.name(site.user_field)),
      8000
    );
    await userField.clear();
    await userField.sendKeys(site.test_user);

    const passField = await driver.wait(
      until.elementLocated(By.name(site.pass_field)),
      8000
    );
    await passField.clear();
    await passField.sendKeys(site.correct_password);

    let button;
    if (site.button_id) {
      button = await driver.findElement(By.id(site.button_id));
    } else {
      button = await driver.findElement(By.css(`.${site.button_class.replace(/\s+/g, ".")}`));
    }

    await button.click();

    await driver.sleep(2000);
    const title = await driver.getTitle();
    console.log(` Título da página após login: ${title}`);

    console.log(" Login testado com sucesso!");
  } catch (err) {
    console.error(` Erro ao testar ${site.url}:`, err.message);
  }
}

async function main() {
  const websites = [
    {
      url: "https://www.saucedemo.com/",
      user_field: "user-name",
      pass_field: "password",
      button_id: "login-button",
      button_class: "",
      test_user: "standard_user",
      correct_password: "secret_sauce",
    },
    {
      url: "https://the-internet.herokuapp.com/login",
      user_field: "username",
      pass_field: "password",
      button_id: "",
      button_class: "radius",
      test_user: "tomsmith",
      correct_password: "SuperSecretPassword!",
    },
    {
      url: "https://practicetestautomation.com/practice-test-login/",
      user_field: "username",
      pass_field: "password",
      button_id: "submit",
      button_class: "",
      test_user: "student",
      correct_password: "Password123",
    },
    {
      url: "https://opensource-demo.orangehrmlive.com/",
      user_field: "username",
      pass_field: "password",
      button_id: "",
      button_class:
        "oxd-button oxd-button--medium oxd-button--main orangehrm-login-button",
      test_user: "Admin",
      correct_password: "admin123",
    },
  ];

  let driver = await new Builder().forBrowser("chrome").build();

  try {
    for (const site of websites) {
      await testLogin(driver, site);
      console.log("=".repeat(60));
      await driver.sleep(2000);
    }
  } finally {
    await driver.quit();
    console.log("\n Testes finalizados. Navegador fechado.");
  }
}

main();