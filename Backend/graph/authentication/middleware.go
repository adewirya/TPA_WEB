package authentication

import (
	"TPANK/graph/model"
	"context"
	"errors"
	"github.com/go-pg/pg/v10"
	"net/http"
)

type context_key struct {
	name string
}

var ctx_key = &context_key{"user"}

func Middleware(db *pg.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

			header := r.Header.Get("Authorization")

			if header == "" {
				next.ServeHTTP(w, r)
				return
			}

			tokenString := header
			username, err := ParseToken(tokenString)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			var user model.User
			err = db.Model(&user).Where("username = ?", username).First()

			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			ctx := context.WithValue(r.Context(), ctx_key, &user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func ForContext(ctx context.Context) (*model.User, error) {
	user, _ := ctx.Value(ctx_key).(*model.User)
	if user == nil {
		return nil, errors.New("Unauthorized Access!")
	}

	return user, nil
}