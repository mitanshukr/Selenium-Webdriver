const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const chalk = require("chalk");
var elapsedTime = require("elapsed-time");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");

var timeStamp = elapsedTime.new().start();
(async function example() {
  let driver = await new Builder().forBrowser("firefox").build();

  try {
    await driver.get("https://www.thesparksfoundationsingapore.org/");
    await driver.manage().setTimeouts({ implicit: 3000 }); //implicitWait

    //Test Case 1: Checking for company Logo in Header
    await driver
      .wait(
        until.elementLocated(By.xpath('//*[@id="home"]/div/div[1]/h1/a'), 2000)
      )
      .getAttribute("href")
      .then(function (output) {
        assert(output == "https://www.thesparksfoundationsingapore.org/");

        driver
          .findElement(By.xpath('//*[@id="home"]/div/div[1]/h1/a/*'))
          .getTagName()
          .then(function (output) {
            assert(output == "img");
            console.log(
              chalk.green("Success-TC1:: Logo Check Successful - Working fine!")
            );
          });
      })
      .catch(function () {
        console.log(chalk.red("Error-TC1:: Something bad with Logo!"));
      });

    //Test Case 2: Checking for Company name in Header
    await driver
      .wait(
        until.elementLocated(By.xpath('//*[@id="home"]/div/div[1]/h1/a'), 2000)
      )
      .getText()
      .then(function (output) {
        if (output.includes("The Sparks Foundation")) {
          assert(true);
          console.log(
            chalk.green("Success-TC2:: Company Name Found in header: ") +
              chalk.black(chalk.bgWhite(output))
          );
        } else assert(false);
      })
      .catch(function () {
        console.log(
          chalk.red("Error-TC2:: Can't find the Company name in Header!")
        );
      });

    //Test Case 3: List out all the h4 tag elements on the Home Page.
    // driver.executeScript("\"xyz\".scrollIntoView({behavior:'smooth'});", result[i]);
    //driver.executeScript(`${result[i]}.scrollIntoView({behavior:'smooth'});`);

    await driver
      .wait(until.elementsLocated(By.css("h4"), 2000))
      .then(function (result) {
        assert(result.length == 4);
        driver.executeScript(
          'window.scrollTo({top: 1500, behavior: "smooth"});'
        );
        console.log(
          chalk.green("Success-TC3: Listing all the h4 tag values: ") +
            result.length
        );
        result.map(function (output) {
          driver.sleep(500);
          output.getText().then(function (txt) {
            console.log(txt);
            driver.sleep(500);
          });
        });
      })
      .catch(function () {
        console.log(chalk.red("Error-TC3: Error with getting h4 elements."));
      });
    await driver.sleep(3000);
    await driver.executeScript(
      'window.scrollTo({top: 0, behavior: "smooth"});'
    );
    await driver.sleep(1000);


    //Test Case 4: Navigating to Vision Page and checking if Vision is correct or not.
    await driver
      .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[1]/a'))
      .click()
      .then(function () {
        driver
          .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[1]/ul/li[1]/a'))
          .click()
          .then(function () {
            console.log("Navigating to About - Vision Page!");
          });
      });
    await driver.sleep(1000);
    await driver
      .wait(
        until.elementsLocated(
          By.xpath("/html/body/div[2]/div/div[1]/div//p"),
          2000
        )
      )
      .then(function (output) {
        const vision =
          "A world of enabled and connected little minds, building future.";
        for (let i = 0; i < output.length; i++) {
          output[i].getText().then(function (txt) {
            if (txt == vision) {
              console.log(
                chalk.green(
                  "Success-TC4:: We are on the right path of our Vision."
                )
              );
              assert(txt == vision);
            } else if (i >= output.length && txt != vision) {
              assert(false);
            }
          });
        }
      })
      .catch(function () {
        console.log(chalk.red("Error-TC4:: It's time to re-define our Paths!"));
      });


    await driver.sleep(500);
    //Test Case 5: Navigate to News Section and check if 3 <iframe> tags are there in the page or not.
    await driver.executeScript(
      "(document.evaluate('/html/body/div[2]/div/div[2]/div/ul/li[7]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue).scrollIntoView({behavior: 'smooth'});"
    );
    await driver.sleep(500);
    await driver
      .wait(
        until.elementLocated(
          By.css(
            "div.w3l_inner_section.about-w3layouts > div > div.col-md-3.agile-blog-sidebar > div > ul > li:nth-child(7) > a"
          ),
          5000
        )
      )
      .click();
    await driver
      .findElements(By.xpath("/html/body/div[3]/div//iframe"))
      .then(function (result) {
        assert(result.length == 3);
        console.log(
          chalk.green("Success-TC5:: Found iframe, expected:3, actual: ") +
            chalk.green(result.length)
        );
      })
      .catch(function (errorMsg) {
        console.log(
          chalk.red(
            "Error-TC5:: Something wrong with iframes. Expected iframes: 3. Error Msg: "
          ) + chalk.bgRed(errorMsg)
        );
      });

      
    //Test Case 6: Filling the 'Join Us form' in Join us Section.
    await driver
      .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[5]/a'))
      .click()
      .then(function () {
        driver
          .findElement(
            By.xpath(
              '//*[@id="link-effect-3"]/ul/li[5]/*//a[text()="Brand Ambassador"]'
            )
          )
          .click()
          .then(function () {
            console.log("Navigating to Join Us - Brand Ambassador Page!");
          });
      });
    await driver.sleep(1000);
    await driver.executeScript(
      "(document.evaluate('/html/body/div[2]/div/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue).scrollIntoView({behavior: 'smooth'});"
    );
    await driver.sleep(1000);
    await driver
      .findElement(By.xpath('//*/form/input[@name="Name"]'))
      .sendKeys("Test User");
    await driver.sleep(500);
    await driver
      .findElement(By.xpath('//*/form/input[@name="Email"]'))
      .sendKeys("test@example.com");
    await driver.sleep(500);
    await driver.findElement(By.xpath("//*/form/select")).click();
    await driver.sleep(800);
    await driver.findElement(By.xpath("//*/form/select/option[4]")).click();
    await driver.sleep(500);
    await driver
      .findElement(By.xpath('//*/form/input[@type="submit"]'))
      .click()
      .then(function () {
        console.log(
          chalk.green("Success-TC6:: Join Us Form submitted - Successful!")
        );
      })
      .catch(function () {
        console.log(
          chalk.red("Error-TC6:: Join Us Form not submitted - Unsuccessful!")
        );
      });
    await driver.sleep(1000);

    //Test Case 7: Checking the contact details in contact page.
    await driver
      .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[6]/a'))
      .click()
      .then(function () {
        console.log("Contact Us - nav Clicked!");
        driver.executeScript(
          'window.scrollTo({top: 300, behavior: "smooth"});'
        );
      });
    await driver
      .findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div[2]/p[2]"))
      .getText()
      .then(function (output) {
        if (
          output.includes("+65-8402-859") &&
          output.includes("info@thesparksfoundation.sg")
        ) {
          console.log(
            chalk.green("Success-TC7:: Contact details, as expected!")
          );
          assert(true);
        } else {
          assert(false);
        }
      })
      .catch(function () {
        console.log(
          chalk.red(
            "Error-TC7:: Harry! People are facing difficulty to contact you!"
          )
        );
      });

    //Test Case 8: Going to Links page and navigating to different website.
    await driver.sleep(1000);
    await driver
      .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[4]/a'))
      .click()
      .then(function () {
        driver
          .findElement(By.xpath('//*[@id="link-effect-3"]/ul/li[4]/ul/li[1]/a'))
          .click()
          .then(function () {
            console.log("Navigating to Links - Software and App Page!");
          });
      });
    await driver.sleep(2000);
    await driver
      .wait(
        until.elementLocated(
          By.xpath("/html/body/div[2]/div/div[2]/div/ul/li[1]/a")
        ),
        2000
      )
      .getAttribute("href")
      .then(function (output) {
        assert(output == "https://links.aine.ai/");
        driver
          .navigate()
          .to(output)
          .then(function () {
            driver
              .wait(until.titleIs("My Credible Info"), 5000)
              .then(function () {
                console.log(
                  chalk.green(
                    "Success-TC8: Navigated Successfully to MCI Page."
                  )
                );
                console.log(
                  chalk.bgCyan("Total time Elapsed: ") +
                    chalk.bgCyan(timeStamp.getValue())
                );
              });
          });
      })
      .catch(function () {
        console.log(chalk.red("Error-TC8: Error with the Naivgation Link!"));
      });
  } finally {
    // console.log(chalk.bgCyan('Total time Elapsed: ') + chalk.bgCyan(timeStamp.getValue()));
    // await driver.quit();
  }
})();
