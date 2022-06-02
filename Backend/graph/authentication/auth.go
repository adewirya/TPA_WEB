package authentication

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/smtp"
	"time"
)

// secret key being used to sign tokens
var (
	SecretKey = []byte("secret")
)

// GenerateToken generates a jwt token and assign a username to it's claims and return it
func GenerateToken(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	/* Create a map to store our claims */
	claims := token.Claims.(jwt.MapClaims)
	/* Set token claims */
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		log.Fatal("Error in Generating key")
		return "", err
	}
	return tokenString, nil
}

// ParseToken parses a jwt token and returns the username in it's claims
func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"].(string)
		return username, nil
	} else {
		return "", err
	}
}

func HashPassword(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes)
}
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func SendGmailOnReset(targetedEmail, code string) error{
	from := "adewirya6@gmail.com"
	fromPassword := "t1malpha89"

	to := []string{targetedEmail}
	message := fmt.Sprintf(
		"To: %s\r\n"+
			"Subject: INsKagram Reset Password Verification Code\r\n"+
			"\r\n"+
			"Click on the link below to reset your password for InSOgram account\n"+
			"Verification URL: http://localhost:1234/resetpassword/%s\n",
		targetedEmail,
		code,
	)

	auth := smtp.PlainAuth("", from, fromPassword, "smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, to, []byte(message))
	if err != nil {
		return err
	}

	return nil
}

func SendGmail(targetEmail, code string) error {

	from := "adewirya6@gmail.com"
	fromPassword := "t1malpha89"

	to := []string{targetEmail}
	message := fmt.Sprintf(
		"To: %s\r\n"+
			"Subject: INsKagram Verification Code\r\n"+
			"\r\n"+
			"Verification URL: http://localhost:1234/verify/%s\r\n"+
			"Code: %s\r\n",
		targetEmail,
		targetEmail,
		code,
	)

	auth := smtp.PlainAuth("", from, fromPassword, "smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, to, []byte(message))
	if err != nil {
		return err
	}

	return nil
}



