package app.tools

import scala.slick.driver.MySQLDriver
import model.DB
import model.DAL
import scala.slick.session.Database
import Database.threadLocalSession

object DBMigration extends App {
  val db = DB.getSlickMysqlConnection()
  val dao = new DAL(MySQLDriver)
  import dao._
  import dao.profile.simple._

  db withSession {
    println("create tables")
    dao.create
    println("insert default symbols")
    Symbols.insertIfNotExists("COMMERZBANK AG", "CBK.DE")
    Symbols.insertIfNotExists("E.ON SE NA", "EOAN.DE")
    Symbols.insertIfNotExists("LBB-PRIVATDEPOT 3 (B)", "A1JSHG.DE")
  }
}
